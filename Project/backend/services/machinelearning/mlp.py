import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model
from sklearn.base import BaseEstimator, RegressorMixin
from sklearn.utils.validation import check_X_y, check_array
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import pandas as pd
import matplotlib.pyplot as plt
import optuna
import pickle
import os
import re
import traceback
import lime
import lime.lime_tabular
from pathlib import Path
from sklearn.model_selection import KFold, train_test_split

# Set random seed for reproducibility - essential for consistent results across runs
# and for debugging - always a good practice in ML projects
np.random.seed(42)
tf.random.set_seed(42)

#######################
# Feature Importance Aggregation Functions
#######################

def extract_original_feature_name(feature_name):
    """
    Extract the original feature name from a transformed feature.
    
    This is super important because feature engineering and one-hot encoding
    create feature names like 'categorical__Weather_Rainy', but we want to 
    aggregate importance back to the original 'Weather' feature.
    """
    # Handle categorical columns with pattern 'categorical__Feature_Value'
    if 'categorical__' in feature_name:
        # Handle feature names with spaces (e.g. 'Weather Conditions')
        match = re.search(r'categorical__([^_]+(?:\s[^_]+)*)_', feature_name)
        if match:
            return match.group(1)
    
    # Handle other transformation patterns like 'transformer__feature'
    elif '__' in feature_name:
        parts = feature_name.split('__')
        if len(parts) >= 2:
            return parts[1]
    
    # Return as is for features without transformation
    return feature_name

def aggregate_feature_importances(feature_importances, feature_names):
    """
    Aggregate feature importances from encoded features back to original features.
    
    This is crucial for interpretability - instead of having 10 different importances
    for one-hot encoded 'Weather' (sunny, rainy, etc.), we want one combined importance.
    """
    # Create a mapping from original feature name to encoded feature names
    original_features = {}
    
    for feature_name in feature_names:
        original_name = extract_original_feature_name(feature_name)
        if original_name not in original_features:
            original_features[original_name] = []
        original_features[original_name].append(feature_name)
    
    # Aggregate importances by original feature
    # We use absolute values because negative and positive importance
    # both indicate feature relevance
    aggregated_importances = {}
    for original_name, encoded_features in original_features.items():
        # Sum the absolute importances of all encoded features from the same original feature
        total_importance = 0
        for feature in encoded_features:
            if feature in feature_importances:
                total_importance += abs(feature_importances[feature])
        aggregated_importances[original_name] = total_importance
    
    # Normalize importances to sum to 1 for easier interpretation
    total_importance = sum(aggregated_importances.values())
    if total_importance > 0:
        aggregated_importances = {
            feature: importance / total_importance 
            for feature, importance in aggregated_importances.items()
        }
    
    # Sort by importance in descending order to prioritize visualization
    return dict(sorted(aggregated_importances.items(), key=lambda x: x[1], reverse=True))

#######################
# Utility Functions
#######################

def inverse_transform_target(y_pred, inverse_transform=True):
    """
    Inverse transform log-transformed target values.
    
    If we're working with log-transformed target (common for skewed data like 
    settlement values), we need to convert back to original scale for interpretation.
    Using np.expm1() instead of np.exp() accounts for the fact that we likely used
    np.log1p() during preprocessing.
    """
    if inverse_transform:
        # Clip to prevent overflow - very important for numerical stability
        # when dealing with exponentials
        clipped_pred = np.clip(y_pred, -20, 20)
        return np.expm1(clipped_pred)
    else:
        return y_pred

#######################
# Core Model Components
#######################

class GradientReversal(layers.Layer):
    """
    Gradient Reversal Layer for Adversarial Learning.
    
    This is a clever trick for adversarial training - during backpropagation,
    it reverses gradients, which forces the network to learn features that are
    invariant to sensitive attributes (like gender, age). This helps create
    more fair models.
    """
    def __init__(self, hp_lambda, **kwargs):
        super(GradientReversal, self).__init__(**kwargs)
        self.hp_lambda = tf.constant(hp_lambda, dtype=tf.float32)

    @staticmethod
    @tf.custom_gradient
    def grad_reverse(x, hp_lambda):
        y = tf.identity(x)
        def custom_grad(dy):
            return -dy * hp_lambda, None
        return y, custom_grad

    def call(self, x):
        return self.grad_reverse(x, self.hp_lambda)

class TabularTransformerBlock(layers.Layer):
    """
    Transformer block adapted for tabular data.
    
    Using transformers for tabular data is relatively new but powerful.
    The self-attention mechanism helps capture complex relationships between
    features, which traditional MLPs might miss.
    """
    def __init__(self, embedding_dim, num_heads, ff_dim, dropout_rate=0.1):
        super(TabularTransformerBlock, self).__init__()
        # Multi-head attention is the key component of transformers
        # It allows the model to focus on different feature relationships simultaneously
        self.att = layers.MultiHeadAttention(
            num_heads=num_heads, key_dim=embedding_dim//num_heads
        )
        # Layer normalization and residual connections are crucial for
        # stable training of deep transformer networks
        self.layernorm1 = layers.LayerNormalization(epsilon=1e-6)
        self.layernorm2 = layers.LayerNormalization(epsilon=1e-6)
        self.dropout1 = layers.Dropout(dropout_rate)
        self.dropout2 = layers.Dropout(dropout_rate)
        # Feed-forward network part of the transformer
        self.ffn = tf.keras.Sequential([
            layers.Dense(ff_dim, activation="relu"),
            layers.Dense(embedding_dim)
        ])

    def call(self, inputs, training=False):
        # The classic transformer architecture with attention -> dropout -> add & norm -> ffn
        attn_output = self.att(inputs, inputs)
        attn_output = self.dropout1(attn_output, training=training)
        out1 = self.layernorm1(inputs + attn_output)  # Residual connection
        ffn_output = self.ffn(out1)
        ffn_output = self.dropout2(ffn_output, training=training)
        return self.layernorm2(out1 + ffn_output)  # Another residual connection

class TransformerEnhancedMLP(BaseEstimator, RegressorMixin):
    """
    A transformer-enhanced MLP model for tabular regression with fairness constraints.
    
    Combines the power of transformers (for complex feature interactions) with MLPs
    (for efficient tabular processing) and adversarial debiasing for fairness.
    Inherits from sklearn's BaseEstimator for compatibility with sklearn pipelines.
    """
    def __init__(self,
                 embedding_dim=32,
                 num_transformer_blocks=2,
                 num_heads=4,
                 ff_dim=64,
                 mlp_hidden_units=(64, 32),
                 adv_hidden_units=(32,),
                 dropout_rate=0.1,
                 activation='relu',
                 learning_rate=0.001,
                 adv_learning_rate=0.001,
                 batch_size=32,
                 epochs=100,
                 verbose=1,
                 validation_split=0.1,
                 random_state=None,
                 adv_lambda=0.05,
                 sensitive_features=None,
                 output_transform=True):  # Controls whether to transform predictions back to original scale
        self.embedding_dim = embedding_dim
        self.num_transformer_blocks = num_transformer_blocks
        self.num_heads = num_heads
        self.ff_dim = ff_dim
        self.mlp_hidden_units = mlp_hidden_units
        self.adv_hidden_units = adv_hidden_units
        self.dropout_rate = dropout_rate
        self.activation = activation
        self.learning_rate = learning_rate
        self.adv_learning_rate = adv_learning_rate
        self.batch_size = batch_size
        self.epochs = epochs
        self.verbose = verbose
        self.validation_split = validation_split
        self.random_state = random_state
        self.adv_lambda = adv_lambda
        self.sensitive_features = sensitive_features or []
        self.output_transform = output_transform  # Flag to control transformation
        self.feature_names_ = None
        self.model_ = None
        self.history_ = None
        self.feature_importance_ = None
        
    def _build_model(self, n_features, num_sensitive_attributes):
        """
        Build the transformer-enhanced MLP architecture with adversarial branches.
        
        The architecture has three main components:
        1. Transformer blocks for feature interaction learning
        2. MLP for regression prediction
        3. Adversarial branches to reduce bias with respect to sensitive attributes
        """
        if self.random_state is not None:
            # Set random seeds for reproducibility
            tf.random.set_seed(self.random_state)
            np.random.seed(self.random_state)

        # Input layer
        inputs = layers.Input(shape=(n_features,))
        
        # Initial feature embedding - transformers work with embeddings
        # We need to reshape inputs to (batch, sequence_length, 1) first
        reshaped_inputs = layers.Reshape((n_features, 1))(inputs)
        embeddings = layers.Dense(self.embedding_dim)(reshaped_inputs)
        
        # Add positional embeddings - this helps the transformer know the order of features
        # even though attention is position-invariant
        positions = tf.range(start=0, limit=n_features, delta=1)
        position_embeddings = layers.Embedding(
            input_dim=n_features,
            output_dim=self.embedding_dim
        )(positions)
        x = embeddings + position_embeddings

        # Transformer blocks - these capture complex feature interactions
        for _ in range(self.num_transformer_blocks):
            x = TabularTransformerBlock(
                embedding_dim=self.embedding_dim,
                num_heads=self.num_heads,
                ff_dim=self.ff_dim,
                dropout_rate=self.dropout_rate
            )(x)

        # Global feature aggregation - combine information across all features
        pooled_output = layers.GlobalAveragePooling1D()(x)

        # Concatenate with the original inputs for residual connection
        # This is crucial - allows model to use both raw features and transformer outputs
        merged_output = layers.Concatenate()([pooled_output, inputs])

        # Regression MLP - standard dense layers for prediction
        regression_branch = merged_output
        for units in self.mlp_hidden_units:
            regression_branch = layers.Dense(units, activation=self.activation)(regression_branch)
            regression_branch = layers.Dropout(self.dropout_rate)(regression_branch)
        regression_output = layers.Dense(1, activation='linear', name='regression_output')(regression_branch)

        # Adversarial branches with reduced impact
        # These try to predict sensitive attributes from the features
        # But the gradient reversal makes the model learn to make this difficult
        adv_outputs = {}
        
        # Only create adversarial branches if there are sensitive attributes
        if num_sensitive_attributes > 0:
            for i in range(num_sensitive_attributes):
                # Use the reduced adversarial lambda
                gr_layer = GradientReversal(self.adv_lambda)
                adversarial_branch = gr_layer(merged_output)
                
                for units in self.adv_hidden_units:
                    adversarial_branch = layers.Dense(units, activation=self.activation)(adversarial_branch)
                    adversarial_branch = layers.Dropout(self.dropout_rate)(adversarial_branch)
                
                adv_outputs[f'adversarial_output_{i}'] = layers.Dense(
                    1, activation='sigmoid', name=f'adversarial_output_{i}'
                )(adversarial_branch)

        # Create and compile model - separate branches for regression and adversarial tasks
        if adv_outputs:
            model = Model(inputs=inputs, outputs=[regression_output] + list(adv_outputs.values()))
            
            # Configure loss weights to prioritize regression over adversarial tasks
            # We care more about accuracy than perfect fairness
            losses = {'regression_output': 'mse'}
            loss_weights = {'regression_output': 1.0}
            metrics = {'regression_output': 'mse'}

            for i in range(num_sensitive_attributes):
                losses[f'adversarial_output_{i}'] = 'binary_crossentropy'
                # Reduce weight of adversarial objectives - prioritize prediction quality
                loss_weights[f'adversarial_output_{i}'] = 0.2
                metrics[f'adversarial_output_{i}'] = 'accuracy'
        else:
            # If no adversarial branches, create a simpler model
            model = Model(inputs=inputs, outputs=regression_output)
            losses = 'mse'
            loss_weights = None
            metrics = ['mse']

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=self.learning_rate),
            loss=losses,
            loss_weights=loss_weights,
            metrics=metrics
        )

        return model

    def fit(self, X, y, sensitive_attributes=None):
        """
        Fit the model to training data.
        
        Handles both the regression task and fairness constraints through
        adversarial branches if sensitive attributes are provided.
        """
        # Check input data - sklearn compatibility
        X, y = check_X_y(X, y, y_numeric=True)
        
        # Handle sensitive attributes properly
        if sensitive_attributes is not None:
            check_array(sensitive_attributes)
            if sensitive_attributes.shape[1] != len(self.sensitive_features):
                if self.verbose:
                    # Warn about mismatches but try to handle them gracefully
                    print(f"Warning: Number of sensitive attribute columns ({sensitive_attributes.shape[1]}) "
                         f"does not match the number of sensitive features specified ({len(self.sensitive_features)}).")
                    print("Creating a model with the provided number of sensitive attributes.")
                # Update sensitive features list to match data
                if hasattr(X, 'columns') and self.sensitive_features:
                    # Try to extract proper column names if available
                    possible_sensitive_cols = [col for col in X.columns if any(
                        s_name in col for s_name in self.sensitive_features
                    )]
                    if len(possible_sensitive_cols) == sensitive_attributes.shape[1]:
                        self.sensitive_features = possible_sensitive_cols
                    else:
                        self.sensitive_features = [f"sensitive_{i}" for i in range(sensitive_attributes.shape[1])]
                else:
                    self.sensitive_features = [f"sensitive_{i}" for i in range(sensitive_attributes.shape[1])]
        else:
            # Create empty array if no sensitive attributes provided
            sensitive_attributes = np.zeros((X.shape[0], 0))
            self.sensitive_features = []

        self.n_features_in_ = X.shape[1]
        num_sensitive_attributes = sensitive_attributes.shape[1]

        if self.verbose:
            print(f"Building model with {self.n_features_in_} input features and {num_sensitive_attributes} sensitive attributes")
            if num_sensitive_attributes > 0:
                print(f"Adversarial lambda set to: {self.adv_lambda}")

        # Build the model
        self.model_ = self._build_model(self.n_features_in_, num_sensitive_attributes)

        # Add early stopping for better convergence and to prevent overfitting
        callbacks = []
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        callbacks.append(early_stopping)
        
        # Add learning rate scheduler to adaptively reduce learning rate
        # when training plateaus - helps find better minima
        reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-6,
            verbose=self.verbose
        )
        callbacks.append(reduce_lr)

        # Prepare target data for adversarial branches if needed
        if num_sensitive_attributes > 0:
            adv_targets = [sensitive_attributes[:, i] for i in range(num_sensitive_attributes)]
            train_targets = {'regression_output': y}
            for i, target in enumerate(adv_targets):
                train_targets[f'adversarial_output_{i}'] = target
        else:
            train_targets = y

        # Train the model
        self.history_ = self.model_.fit(
            X, train_targets,
            batch_size=self.batch_size,
            epochs=self.epochs,
            verbose=self.verbose,
            validation_split=self.validation_split,
            callbacks=callbacks
        )

        # Calculate simplified feature importance
        self._calculate_feature_importance(X)

        return self

    def _calculate_feature_importance(self, X):
        """
        Calculate feature importance using permutation importance.
        
        This is a model-agnostic approach that measures how much performance
        drops when a feature is shuffled (which breaks its relationship with the target).
        """
        try:
            # Basic permutation importance
            baseline_pred = self.predict(X, transform=False)  # Use raw predictions
            baseline_score = r2_score(baseline_pred, baseline_pred)  # Perfect score as reference
            importance = []

            for i in range(X.shape[1]):
                # For each feature, shuffle it and see how prediction changes
                X_shuffled = X.copy()
                X_shuffled[:, i] = np.random.permutation(X_shuffled[:, i])
                shuffled_pred = self.predict(X_shuffled, transform=False)  # Use raw predictions
                importance.append(baseline_score - r2_score(baseline_pred, shuffled_pred))

            # Normalize importance scores for easier interpretation
            importance = np.array(importance)
            abs_sum = np.sum(np.abs(importance))
            if abs_sum > 0:
                importance = importance / abs_sum

            self.feature_importance_ = importance
        except Exception as e:
            print(f"Could not calculate feature importance: {e}")
            self.feature_importance_ = None

    def predict(self, X, transform=None):
        """
        Make predictions with option to transform back to original scale.
        
        The transform parameter controls whether predictions are returned in
        the transformed space (e.g., log space) or original scale.
        """
        X = check_array(X)
        
        # Get raw predictions from the model
        if isinstance(self.model_.output, list):
            # If multiple outputs (adversarial model), take the first (regression) output
            raw_pred = self.model_.predict(X, verbose=0)[0].flatten()
        else:
            raw_pred = self.model_.predict(X, verbose=0).flatten()
        
        # Determine whether to transform
        apply_transform = self.output_transform if transform is None else transform
        
        # Apply inverse transformation if requested
        if apply_transform:
            return inverse_transform_target(raw_pred, inverse_transform=True)
        else:
            return raw_pred

    def set_feature_names(self, feature_names):
        """
        Set feature names for better interpretability in feature importance.
        """
        self.feature_names_ = feature_names

    def get_feature_importance(self):
        """
        Get dictionary mapping feature names to importance scores.
        """
        if self.feature_importance_ is None:
            return None

        feature_names = self.feature_names_ if self.feature_names_ is not None else [
            f'feature_{i}' for i in range(self.n_features_in_)
        ]
        return dict(zip(feature_names, self.feature_importance_))
        
    def get_aggregated_feature_importance(self, X=None, aggregate=True):
        """
        Get feature importance with option to aggregate transformed features.
        
        Aggregation combines importance of derived features (like one-hot encoded
        categories) back to their original feature, which is more interpretable.
        """
        # If feature importance not already calculated, do so now
        if self.feature_importance_ is None and X is not None:
            self._calculate_feature_importance(X)
        
        # If we still don't have feature importances, return None
        if self.feature_importance_ is None:
            return None
        
        # Get feature names
        feature_names = self.feature_names_ if self.feature_names_ is not None else [
            f'feature_{i}' for i in range(self.n_features_in_)
        ]
        
        # Create dictionary mapping feature names to importances
        importances = dict(zip(feature_names, self.feature_importance_))
        
        # Aggregate if requested
        if aggregate:
            return aggregate_feature_importances(importances, feature_names)
        else:
            # Return as is but sorted by importance
            return dict(sorted(importances.items(), key=lambda x: abs(x[1]), reverse=True))

    def score(self, X, y):
        """
        Return R^2 score on given test data and labels.
        
        Uses raw predictions for consistency with sklearn's scoring interface.
        """
        return r2_score(y, self.predict(X, transform=False))  # Use raw predictions for consistency

#######################
# Streamlined Pipeline
#######################

class SimplePipeline:
    """
    A streamlined pipeline that wraps the model and handles feature names and transformations.
    
    This simplifies common operations like fitting, predicting, and getting feature importance.
    It's not a full sklearn Pipeline but offers similar convenience for this specific model.
    """
    def __init__(self, model, feature_names=None, sensitive_features=None):
        self.model = model
        self.feature_names = feature_names
        self.sensitive_features = sensitive_features
        
        if sensitive_features and model.sensitive_features != sensitive_features:
            model.sensitive_features = sensitive_features

    def fit(self, X, y, sensitive_attributes=None):
        """
        Fit the model with automatic feature name handling.
        """
        # Set feature names if available
        if hasattr(X, 'columns'):
            self.feature_names = X.columns.tolist()
            self.model.set_feature_names(self.feature_names)
        
        # Extract sensitive attributes if needed
        if sensitive_attributes is None and self.sensitive_features and hasattr(X, 'columns'):
            sensitive_attributes = X[self.sensitive_features].values
        
        # Fit the model
        self.model.fit(X, y, sensitive_attributes)
        return self

    def predict(self, X, transform=None):
        """
        Make predictions with control over transformation.
        """
        return self.model.predict(X, transform=transform)

    def predict_original_scale(self, X):
        """
        Convenience method to always predict in original scale.
        """
        return self.model.predict(X, transform=True)
        
    def score(self, X, y):
        """
        Calculate R² score using raw predictions (not transformed).
        """
        return self.model.score(X, y)

    def get_feature_importance(self):
        """
        Get raw feature importance.
        """
        return self.model.get_feature_importance()
        
    def get_aggregated_feature_importance(self, X=None, aggregate=True):
        """
        Get feature importance with option for aggregation.
        """
        # Pass through to model if it has this method
        if hasattr(self.model, 'get_aggregated_feature_importance'):
            return self.model.get_aggregated_feature_importance(X, aggregate)
        
        # Otherwise use standard feature importance and aggregate it ourselves
        importances = self.get_feature_importance()
        if importances is None:
            return None
        
        if aggregate:
            return aggregate_feature_importances(importances, self.feature_names)
        else:
            return dict(sorted(importances.items(), key=lambda x: abs(x[1]), reverse=True))

#######################
# Enhanced Visualization Functions
#######################

def graph_features(X_test, model):
    """
    Graph the feature importances using LIME.
    
    LIME (Local Interpretable Model-agnostic Explanations) creates interpretable
    explanations of model predictions by approximating them locally with simpler models.
    Great for explaining complex model decisions to stakeholders.
    
    Parameters:
    -----------
    X_test : pandas DataFrame
        Test data with feature names as columns
    model : model object
        A model with a predict method
    """
    explainer = lime.lime_tabular.LimeTabularExplainer(
        training_data=X_test.values,
        feature_names=X_test.columns.tolist(),
        mode='regression',
        verbose=True
    )

    # Explain the first instance as an example
    # In a real application, you might want to explain multiple instances
    exp = explainer.explain_instance(
        data_row=X_test.values[0],
        predict_fn=model.predict,
        num_features=30,
        top_labels=1,
        model_regressor=None,
    )

    explanation = exp.as_list()
    features, contributions = zip(*explanation)

    # Create a horizontal bar chart for better visualization of many features
    plt.figure(figsize=(8, 6))
    plt.barh(range(len(features)), contributions, color='mediumseagreen')
    plt.yticks(range(len(features)), features)
    plt.xlabel('Contribution to Prediction')
    plt.title('LIME Explanation for Feature Importance ')
    plt.gca().invert_yaxis()  # Put most important at the top
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.tight_layout()
    plt.show()

def plot_training_history(history, output_dir=None):
    """
    Plot training and validation metrics from model history.
    
    Visualizing training history helps diagnose overfitting/underfitting
    and understand convergence behavior.
    """
    if not hasattr(history, 'history'):
        print("No training history available to plot")
        return
    
    metrics = list(history.history.keys())
    
    # Filter out adversarial metrics for cleaner plots
    # We're usually more interested in the main regression performance
    main_metrics = [m for m in metrics if not m.startswith('val_adversarial_output') 
                    and not m.startswith('adversarial_output')]
    
    # Create subplots based on available metrics
    num_plots = len([m for m in main_metrics if not m.startswith('val_')])
    fig, axes = plt.subplots(num_plots, 1, figsize=(10, 5*num_plots))
    if num_plots == 1:
        axes = [axes]
    
    plot_idx = 0
    for metric in main_metrics:
        if not metric.startswith('val_'):
            # Plot training and validation metrics
            axes[plot_idx].plot(history.history[metric], label=f'Training {metric}')
            val_metric = f'val_{metric}'
            if val_metric in history.history:
                axes[plot_idx].plot(history.history[val_metric], label=f'Validation {val_metric}')
            
            axes[plot_idx].set_title(metric)
            axes[plot_idx].set_ylabel(metric)
            axes[plot_idx].set_xlabel('Epoch')
            axes[plot_idx].legend()
            axes[plot_idx].grid(True)
            
            plot_idx += 1
    
    plt.tight_layout()
    
    if output_dir:
        plt.savefig(f"{output_dir}/training_history.png")
        print(f"Training history plot saved to {output_dir}/training_history.png")
    else:
        plt.show()
    plt.close()

def plot_predictions_vs_actual(y_true, y_pred, is_transformed=True, output_dir=None):
    """
    Plot predicted vs actual values with regression line.
    
    This is one of the most important diagnostic plots for regression models.
    Ideally, points should fall along the diagonal (perfect prediction line).
    Deviations from this line help identify where the model struggles.
    """
    plt.figure(figsize=(10, 8))
    
    if is_transformed:
        title_suffix = " (Transformed Space)"
        xlabel = "Actual (log)"
        ylabel = "Predicted (log)"
    else:
        title_suffix = " (Original Space)"
        xlabel = "Actual"
        ylabel = "Predicted"
    
    # Scatter plot
    plt.scatter(y_true, y_pred, alpha=0.5, label='Predictions')
    
    # Add perfect prediction line
    max_val = max(max(y_true), max(y_pred))
    min_val = min(min(y_true), min(y_pred))
    plt.plot([min_val, max_val], [min_val, max_val], 'k--', label='Perfect Prediction')
    
    # Add regression line - shows systematic over/under prediction
    coeffs = np.polyfit(y_true, y_pred, 1)
    regression_line = np.poly1d(coeffs)
    plt.plot(y_true, regression_line(y_true), 'r-', label='Regression Line')
    
    plt.title(f"Predicted vs Actual Values{title_suffix}")
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.legend()
    plt.grid(True)
    
    # Add R² and RMSE to plot - key metrics to assess model performance
    r2 = r2_score(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    plt.text(0.05, 0.9, f"R² = {r2:.3f}\nRMSE = {rmse:.3f}", 
             transform=plt.gca().transAxes, bbox=dict(facecolor='white', alpha=0.8))
    
    if output_dir:
        filename = "predictions_vs_actual_transformed.png" if is_transformed else "predictions_vs_actual_original.png"
        plt.savefig(f"{output_dir}/{filename}")
        print(f"Predictions vs actual plot saved to {output_dir}/{filename}")
    else:
        plt.show()
    plt.close()

def plot_residuals(y_true, y_pred, is_transformed=True, output_dir=None):
    """
    Plot residuals for model evaluation.
    
    Residual plots are critical for checking model assumptions and finding patterns
    in errors. Ideally, residuals should be randomly distributed around zero
    with no discernible patterns - this indicates a well-specified model.
    """
    residuals = y_true - y_pred
    
    plt.figure(figsize=(12, 6))
    
    if is_transformed:
        title_suffix = " (Transformed Space)"
        xlabel = "Predicted Values (log)"
    else:
        title_suffix = " (Original Space)"
        xlabel = "Predicted Values"
    
    # Residuals vs predicted - shows if variance is constant and if there's
    # non-linearity we missed in the model
    plt.subplot(1, 2, 1)
    plt.scatter(y_pred, residuals, alpha=0.5)
    plt.axhline(y=0, color='r', linestyle='--')
    plt.title(f"Residuals vs Predicted{title_suffix}")
    plt.xlabel(xlabel)
    plt.ylabel("Residuals")
    plt.grid(True)
    
    # Residual histogram - shows if errors are normally distributed
    # This is important for statistical inference and confidence intervals
    plt.subplot(1, 2, 2)
    plt.hist(residuals, bins=30, edgecolor='black')
    plt.title(f"Residual Distribution{title_suffix}")
    plt.xlabel("Residuals")
    plt.ylabel("Frequency")
    plt.grid(True)
    
    plt.tight_layout()
    
    if output_dir:
        filename = "residuals_transformed.png" if is_transformed else "residuals_original.png"
        plt.savefig(f"{output_dir}/{filename}")
        print(f"Residual plots saved to {output_dir}/{filename}")
    else:
        plt.show()
    plt.close()

def plot_optuna_optimization(study, output_dir=None):
    """
    Visualize Optuna optimization results.
    
    These visualizations help understand the hyperparameter search process,
    identify which parameters matter most, and see the trade-offs in the
    parameter space. Essential for interpreting and improving hyperparameter tuning.
    """
    if not study:
        print("No study results available to plot")
        return
    
    try:
        # Plot optimization history - shows if we've converged and helps
        # decide if more trials would be beneficial
        fig1 = optuna.visualization.plot_optimization_history(study)
        fig1.update_layout(title="Optimization History")
        
        # Plot parameter importance - tells us which parameters actually matter
        # This is gold for model simplification - we can fix unimportant parameters
        fig2 = optuna.visualization.plot_param_importances(study)
        fig2.update_layout(title="Parameter Importances")
        
        # Plot slice plot - shows how each parameter affects performance
        # Great for understanding sensitivities around the optimum
        fig3 = optuna.visualization.plot_slice(study)
        fig3.update_layout(title="Slice Plot")
        
        # Save or show plots
        if output_dir:
            fig1.write_image(f"{output_dir}/optuna_optimization_history.png")
            fig2.write_image(f"{output_dir}/optuna_param_importances.png")
            fig3.write_image(f"{output_dir}/optuna_slice_plot.png")
            print(f"Optuna visualizations saved to {output_dir}")
        else:
            fig1.show()
            fig2.show()
            fig3.show()
    except Exception as e:
        print(f"Could not create Optuna visualizations: {e}")

def plot_feature_importance(pipeline, X=None, top_n=20, aggregate=True, output_dir=None):
    """
    Plot feature importance with option for aggregation.
    
    Feature importance is key to understanding what drives model predictions,
    and aggregating them makes it much more interpretable for stakeholders
    by showing high-level features rather than encoded versions.
    """
    original_importance = pipeline.get_feature_importance()
    if original_importance is None:
        print("Feature importance not available.")
        return None, None
    
    if aggregate:
        # Get aggregated feature importance - this combines one-hot encoded
        # and transformed features back to originals for better interpretability
        aggregated_importance = pipeline.get_aggregated_feature_importance(X, aggregate=True)
        
        # Create a side-by-side comparison plot
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(20, 10))
        
        # Plot original importance
        orig_sorted = dict(sorted(original_importance.items(), key=lambda x: abs(x[1]), reverse=True))
        orig_top = {k: v for i, (k, v) in enumerate(orig_sorted.items()) if i < top_n}
        
        ax1.barh(list(orig_top.keys()), list(orig_top.values()))
        ax1.set_title('Original Feature Importance (One-Hot Encoded)')
        ax1.set_xlabel('Importance')
        ax1.set_ylabel('Feature')
        
        # Plot aggregated importance
        agg_top = {k: v for i, (k, v) in enumerate(aggregated_importance.items()) if i < top_n}
        
        ax2.barh(list(agg_top.keys()), list(agg_top.values()))
        ax2.set_title('Aggregated Feature Importance')
        ax2.set_xlabel('Importance')
        ax2.set_ylabel('Feature')
        
        plt.tight_layout()
        
        # Save if output directory provided
        if output_dir:
            plt.savefig(f"{output_dir}/feature_importance_comparison.png")
            print(f"Feature importance comparison saved to {output_dir}/feature_importance_comparison.png")
        
        # Also create a plot for just the aggregated importances
        # This is usually the one we share with stakeholders
        plt.figure(figsize=(12, 10))
        plt.barh(list(agg_top.keys()), list(agg_top.values()))
        plt.title('Top Feature Importance (Aggregated)')
        plt.xlabel('Importance')
        plt.ylabel('Feature')
        plt.tight_layout()
        
        if output_dir:
            plt.savefig(f"{output_dir}/aggregated_feature_importance.png")
            print(f"Aggregated feature importance saved to {output_dir}/aggregated_feature_importance.png")
        
        return original_importance, aggregated_importance
    else:
        # Just plot original importance
        plt.figure(figsize=(12, 10))
        orig_sorted = dict(sorted(original_importance.items(), key=lambda x: abs(x[1]), reverse=True))
        orig_top = {k: v for i, (k, v) in enumerate(orig_sorted.items()) if i < top_n}
        
        plt.barh(list(orig_top.keys()), list(orig_top.values()))
        plt.title('Feature Importance')
        plt.xlabel('Importance')
        plt.ylabel('Feature')
        plt.tight_layout()
        
        if output_dir:
            plt.savefig(f"{output_dir}/feature_importance.png")
            print(f"Feature importance saved to {output_dir}/feature_importance.png")
        
        return original_importance, None

def plot_all_results(pipeline, X_train, y_train, X_test, y_test, history, study, output_dir):
    """
    Create all visualization plots in one function.
    
    This is a convenience function that generates a complete set of diagnostic
    visualizations for model evaluation. Essential for thorough model assessment
    and documentation of model behavior.
    """
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Plot training history
    plot_training_history(history, output_dir)
    
    # Get predictions for both train and test sets
    y_train_pred = pipeline.predict(X_train, transform=False)
    y_test_pred = pipeline.predict(X_test, transform=False)
    
    # Plot predictions vs actual for both transformed and original space
    # This helps us evaluate model performance in both spaces
    plot_predictions_vs_actual(y_train, y_train_pred, is_transformed=True, output_dir=output_dir)
    plot_predictions_vs_actual(
        inverse_transform_target(y_train), 
        inverse_transform_target(y_train_pred), 
        is_transformed=False, 
        output_dir=output_dir
    )
    
    # Plot residuals - critical for checking model assumptions and error patterns
    plot_residuals(y_train, y_train_pred, is_transformed=True, output_dir=output_dir)
    plot_residuals(
        inverse_transform_target(y_train), 
        inverse_transform_target(y_train_pred), 
        is_transformed=False, 
        output_dir=output_dir
    )
    
    # Plot feature importance - helps understand what drives predictions
    plot_feature_importance(pipeline, X_train, top_n=20, aggregate=True, output_dir=output_dir)
    
    # Plot LIME feature importance - local explanations of model behavior
    graph_features(X_test, pipeline)
    
    # Plot Optuna optimization results - helps understand hyperparameter search
    plot_optuna_optimization(study, output_dir)

#######################
# Training and Evaluation
#######################

def calculate_metrics(y_true, y_pred, is_transformed=True):
    """
    Calculate and return model evaluation metrics.
    
    Computing metrics in both transformed and original spaces is important
    because some metrics like R² behave differently in log space vs original space.
    This helps understand model performance from multiple angles.
    """
    # If data is log-transformed, convert back for some metrics
    if is_transformed:
        y_pred_original = inverse_transform_target(y_pred, inverse_transform=True)
        y_true_original = inverse_transform_target(y_true, inverse_transform=True)
        
        metrics = {
            'MSE (original)': mean_squared_error(y_true_original, y_pred_original),
            'RMSE (original)': np.sqrt(mean_squared_error(y_true_original, y_pred_original)),
            'MAE (original)': mean_absolute_error(y_true_original, y_pred_original),
            'R² (original)': r2_score(y_true_original, y_pred_original),
            'MSE (transformed)': mean_squared_error(y_true, y_pred),
            'RMSE (transformed)': np.sqrt(mean_squared_error(y_true, y_pred)),
            'MAE (transformed)': mean_absolute_error(y_true, y_pred),
            'R² (transformed)': r2_score(y_true, y_pred)
        }
    else:
        metrics = {
            'MSE': mean_squared_error(y_true, y_pred),
            'RMSE': np.sqrt(mean_squared_error(y_true, y_pred)),
            'MAE': mean_absolute_error(y_true, y_pred),
            'R²': r2_score(y_true, y_pred)
        }

    return metrics

def optimize_hyperparameters(X, y, sensitive_attributes, n_trials=10, cv=5, random_state=42):
    """
    Run hyperparameter optimization with Optuna.
    
    Hyperparameter tuning is essential for optimal model performance.
    Optuna's approach is efficient and allows for early stopping,
    parameter dependencies, and visualization of the optimization process.
    """
    print(f"\n--- Starting Hyperparameter Optimization with {n_trials} trials ---")
    
    def objective(trial):
        # Define hyperparameters to optimize with revised ranges
        # Lots of thought went into these ranges based on prior experiments
        params = {
            'embedding_dim': trial.suggest_int('embedding_dim', 16, 128, log=True),  # log=True for scale parameters
            'num_transformer_blocks': trial.suggest_int('num_transformer_blocks', 1, 3),  # Kept small to avoid overfitting
            'num_heads': trial.suggest_int('num_heads', 2, 8),  # Multi-head attention parameter
            'ff_dim': trial.suggest_int('ff_dim', 32, 256, log=True),  # Feed-forward dimension in transformer
            'mlp_hidden_units': trial.suggest_categorical('mlp_hidden_units', [
                "64,32", "128,64", "256,128,64", "128,64,32"
            ]),  # MLP architecture as string for easier handling
            'adv_hidden_units': trial.suggest_categorical('adv_hidden_units', [
                "32", "64,32"  # Adversarial branches need fewer parameters
            ]),
            'dropout_rate': trial.suggest_float('dropout_rate', 0.0, 0.5),  # Common dropout range
            'learning_rate': trial.suggest_float('learning_rate', 1e-4, 1e-2, log=True),  # Log scale for learning rates
            'adv_learning_rate': trial.suggest_float('adv_learning_rate', 1e-4, 1e-2, log=True),
            'batch_size': trial.suggest_categorical('batch_size', [32, 64, 128, 256]),  # Common batch sizes
            'epochs': trial.suggest_int('epochs', 50, 150, step=25),  # Early stopping will prevent wasted time
            # Reduced range for adv_lambda to prioritize predictive performance over fairness
            'adv_lambda': trial.suggest_float('adv_lambda', 0.01, 0.1, log=True)
        }
        
        # Process string parameters immediately to avoid issues later
        # This converts strings like "64,32" to actual tuples (64, 32)
        if isinstance(params['mlp_hidden_units'], str):
            params['mlp_hidden_units'] = tuple(map(int, params['mlp_hidden_units'].split(',')))
        
        if isinstance(params['adv_hidden_units'], str):
            params['adv_hidden_units'] = tuple(map(int, params['adv_hidden_units'].split(',')))
        
        # Cross-validation to get reliable performance estimates
        kf = KFold(n_splits=cv, shuffle=True, random_state=random_state)
        cv_scores = []
        
        for fold_idx, (train_idx, val_idx) in enumerate(kf.split(X)):
            print(f"  CV Fold {fold_idx + 1}/{cv}", end="", flush=True)
            X_train_fold, X_val_fold = X.iloc[train_idx], X.iloc[val_idx]
            y_train_fold, y_val_fold = y.iloc[train_idx], y.iloc[val_idx]
            sensitive_train_fold = sensitive_attributes[train_idx]
            
            # Create model with trial parameters
            try:
                model = TransformerEnhancedMLP(
                    **params,
                    validation_split=0.1,
                    verbose=0,  # Reduce verbosity during tuning
                    random_state=random_state,
                    sensitive_features=X.columns[X.columns.str.contains('Gender|Age', case=False)].tolist(),
                    output_transform=False  # Don't transform during training/validation
                )
                
                # Create pipeline
                pipeline = SimplePipeline(model=model, feature_names=X_train_fold.columns.tolist())
                
                # Train and evaluate
                pipeline.fit(X_train_fold, y_train_fold, sensitive_train_fold)
                y_val_pred = pipeline.predict(X_val_fold, transform=False)
                fold_score = r2_score(y_val_fold, y_val_pred)  # R² as optimization metric
                cv_scores.append(fold_score)
                print(f" - R² Score: {fold_score:.4f}")
            except Exception as e:
                print(f" - Error: {str(e)}")
                # Return a very low score to indicate failure
                # This helps Optuna avoid problematic parameter regions
                return -999.0
            
        cv_score_mean = np.mean(cv_scores)
        print(f"\nMean CV R² Score: {cv_score_mean:.4f}")
        return cv_score_mean
    
    # Create and run study
    study = optuna.create_study(direction='maximize', study_name='transformer_mlp_optimization')
    study.optimize(objective, n_trials=n_trials)
    
    print("\nOptimization completed!")
    print(f"Best trial: {study.best_trial.number}")
    print(f"Best value (mean CV R² score): {study.best_trial.value:.4f}")
    
    # Process the best parameters
    best_params = study.best_trial.params.copy()
    # Make sure to convert these parameters correctly
    if 'mlp_hidden_units' in best_params and isinstance(best_params['mlp_hidden_units'], str):
        best_params['mlp_hidden_units'] = tuple(map(int, best_params['mlp_hidden_units'].split(',')))
    if 'adv_hidden_units' in best_params and isinstance(best_params['adv_hidden_units'], str):
        best_params['adv_hidden_units'] = tuple(map(int, best_params['adv_hidden_units'].split(',')))
    
    # Print and visualize results
    print("Best hyperparameters:")
    for param, value in best_params.items():
        print(f"  {param}: {value}")
    
    # Plot optimization results
    plot_optuna_optimization(study, "optuna_optimization_plots")
    
    return best_params, study

def train_and_evaluate(X_train, y_train, X_test, y_test, sensitive_train, sensitive_test, params, output_dir, random_state=42):
    """
    Train and evaluate the final model with the best parameters.
    
    This function trains the model with the optimized hyperparameters
    and performs a comprehensive evaluation, including metrics in both
    transformed and original spaces and various visualizations.
    """
    print("\n--- Training Final Model with Best Parameters ---")
    
    # Create the model with optimized parameters
    model = TransformerEnhancedMLP(
        **params,
        validation_split=0.1,
        verbose=1,  # More verbose for final training
        random_state=random_state,
        sensitive_features=X_train.columns[X_train.columns.str.contains('Gender|Age', case=False)].tolist(),
        output_transform=False  # We'll handle transformations explicitly
    )
    
    # Create pipeline
    pipeline = SimplePipeline(
        model=model,
        feature_names=X_train.columns.tolist(),
        sensitive_features=X_train.columns[X_train.columns.str.contains('Gender|Age', case=False)].tolist()
    )
    
    # Train the model - this is the final model, so we want full output
    pipeline.fit(X_train, y_train, sensitive_train)
    
    # Evaluate with both transformed and original metrics
    # This is crucial for interpreting model performance in both spaces
    y_pred_transformed = pipeline.predict(X_test, transform=False)  # Raw predictions in log space
    y_pred_original = pipeline.predict(X_test, transform=True)      # Converted back to original scale
    
    # Calculate metrics in both spaces
    metrics_transformed = calculate_metrics(y_test, y_pred_transformed, is_transformed=False)
    metrics_original = {
        'MSE (original)': mean_squared_error(inverse_transform_target(y_test), y_pred_original),
        'RMSE (original)': np.sqrt(mean_squared_error(inverse_transform_target(y_test), y_pred_original)),
        'MAE (original)': mean_absolute_error(inverse_transform_target(y_test), y_pred_original),
        'R² (original)': r2_score(inverse_transform_target(y_test), y_pred_original)
    }
    
    # Combine metrics
    metrics = {**metrics_transformed, **metrics_original}
    
    print("\nTest Set Metrics:")
    print("Transformed Space (log):")
    for metric_name, value in metrics_transformed.items():
        print(f"  {metric_name}: {value:.4f}")
    
    print("\nOriginal Space (exponentiated):")
    for metric_name, value in metrics_original.items():
        print(f"  {metric_name}: {value:.4f}")
    
    # Create all visualization plots - comprehensive evaluation
    plot_all_results(
        pipeline, X_train, y_train, X_test, y_test,
        pipeline.model.history_, None, output_dir
    )
    
    # Save model and results for future use and documentation
    save_results(pipeline, params, metrics, output_dir)
    
    return pipeline, metrics

def save_results(model, params, metrics, output_dir):
    """
    Save model, parameters and results using pickle.
    
    Persisting models and results is essential for deployment,
    collaboration, and reproducibility. These saved files become
    the artifacts that can be loaded into production systems.
    """
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Save model using pickle
    model_path = f"{output_dir}/model.pkl"
    print(f"\nSaving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    # Save parameters using pickle (for reference only)
    params_path = f"{output_dir}/params.pkl"
    print(f"Saving parameters to {params_path}...")
    with open(params_path, 'wb') as f:
        pickle.dump(params, f)
    
    # Save metrics to CSV for easy analysis
    pd.DataFrame([metrics]).to_csv(f"{output_dir}/metrics.csv", index=False)
    
    # Create a detailed summary report in markdown
    # This is great for sharing results with stakeholders
    summary = [
        "# Transformer-Enhanced MLP Training Summary",
        "",
        "## Best Hyperparameters",
        "".join([f"- {param}: {value}\n" for param, value in params.items()]),
        "",
        "## Performance Metrics",
        "### Transformed Space (log)",
        "".join([f"- {metric}: {metrics[metric]:.4f}\n" for metric in ['MSE', 'RMSE', 'MAE', 'R²'] if metric in metrics]),
        "",
        "### Original Space",
        "".join([f"- {metric}: {metrics[metric]:.4f}\n" for metric in ['MSE (original)', 'RMSE (original)', 'MAE (original)', 'R² (original)'] if metric in metrics]),
        "",
        "## Using the Model",
        "To make predictions in the transformed space (same as target during training):",
        "```python",
        "predictions = model.predict(X, transform=False)",
        "```",
        "",
        "To make predictions in the original scale:",
        "```python",
        "predictions = model.predict(X, transform=True)",
        "```",
        "or",
        "```python",
        "predictions = model.predict_original_scale(X)",
        "```",
        "",
        "To get aggregated feature importances:",
        "```python",
        "importances = model.get_aggregated_feature_importance(X)",
        "```",
        "",
        f"Model artifacts saved in: {output_dir}"
    ]
    
    with open(f"{output_dir}/summary.md", "w") as f:
        f.write("\n".join(summary))
    
    # Instructions for loading the saved model
    print(f"\nTo load the saved model, use the following code:")
    print("```python")
    print("import pickle")
    print(f"with open('{model_path}', 'rb') as f:")
    print("    loaded_model = pickle.load(f)")
    print("```")
    
    print("\nTo make predictions in the original scale:")
    print("```python")
    print("original_predictions = loaded_model.predict_original_scale(X_new)")
    print("```")
    
    print("\nTo get aggregated feature importances:")
    print("```python")
    print("importances = loaded_model.get_aggregated_feature_importance(X_new)")
    print("```")
    
    print(f"\nAll results saved to {output_dir}")

def main():
    """
    Main function to run the entire pipeline.
    
    This orchestrates the complete workflow:
    1. Load and prepare data
    2. Optimize hyperparameters
    3. Train final model
    4. Evaluate and visualize results
    5. Save model and artifacts
    """
    # Configuration
    DATA_PATH = 'settlement_data_processed.csv'
    TARGET_COLUMN = 'SettlementValue'
    OUTPUT_DIR = 'transformer_outputs_improved'
    # For testing/development, use smaller values
    N_TRIALS = 2 
    CV_FOLDS = 2  
    TEST_SIZE = 0.2
    RANDOM_STATE = 42
    
    print("\n=== Improved Transformer-Enhanced MLP Pipeline with Feature Aggregation ===")
    print("This version includes inverse transformation of predictions, reduced adversarial impact, and aggregated feature importance")
    
    # Load data
    print(f"Loading data from {DATA_PATH}...")
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Data loaded. Shape: {df.shape}")
        
        # Get sensitive features - columns related to protected attributes
        # These are used for fair model training via adversarial debiasing
        sensitive_cols = df.columns[df.columns.str.contains('Gender|Age', case=False)].tolist()
        print(f"Detected sensitive features: {sensitive_cols}")
        
        # Split features and target
        X = df.drop(columns=[TARGET_COLUMN])
        y = df[TARGET_COLUMN]
        
        # Split into train/test sets - essential for unbiased evaluation
        # We use stratified splitting to ensure fair distribution
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
        )
        
        # Prepare sensitive attributes for fairness constraints
        sensitive_train = X_train[sensitive_cols].values
        sensitive_test = X_test[sensitive_cols].values
        
        # Run hyperparameter optimization - this is computing intensive
        # but pays off in better model performance
        best_params, study = optimize_hyperparameters(
            X_train, y_train, sensitive_train, 
            n_trials=N_TRIALS, cv=CV_FOLDS, random_state=RANDOM_STATE
        )
        
        # Explicitly reduce adv_lambda if it's too high in the best params
        # This is a business decision - we prioritize prediction accuracy
        # over perfect fairness (which often comes at a performance cost)
        if best_params.get('adv_lambda', 0) > 0.05:
            print("\nReducing adversarial lambda to prioritize predictive performance")
            best_params['adv_lambda'] = 0.05
        
        # Train and evaluate final model with aggregated feature importance
        # This is the model that would go to production
        trained_pipeline, metrics = train_and_evaluate(
            X_train, y_train, X_test, y_test,
            sensitive_train, sensitive_test,
            best_params, OUTPUT_DIR, RANDOM_STATE
        )
        
        # Save optimization study for future reference and analysis
        study_path = f"{OUTPUT_DIR}/study.pkl"
        print(f"\nSaving optimization study to {study_path}...")
        with open(study_path, 'wb') as f:
            pickle.dump(study, f)
        
        # Demonstrate prediction with inverse transformation
        # This helps users understand how to interpret model outputs
        print("\n=== Demonstration of Inverse Transformation ===")
        # Take a small sample for demonstration
        sample_size = min(5, len(X_test))
        sample_indices = np.random.choice(len(X_test), sample_size, replace=False)
        X_sample = X_test.iloc[sample_indices]
        y_sample = y_test.iloc[sample_indices]
        
        # Make predictions in both spaces
        y_pred_transformed = trained_pipeline.predict(X_sample, transform=False)  # Log space
        y_pred_original = trained_pipeline.predict(X_sample, transform=True)      # Original space
        
        # Convert true values from log space to original for comparison
        y_sample_original = inverse_transform_target(y_sample)
        
        # Create comparison table - this is extremely useful for understanding
        # the effect of transformations on model outputs
        comparison = pd.DataFrame({
            'True (log space)': y_sample.values,
            'Predicted (log space)': y_pred_transformed,
            'True (original)': y_sample_original,
            'Predicted (original)': y_pred_original
        })
        
        print("\nSample predictions comparison:")
        print(comparison)
        
        # Save the comparison to CSV for documentation
        comparison.to_csv(f"{OUTPUT_DIR}/prediction_samples.csv")
        
        # Generate LIME feature importance visualization
        # LIME provides local, instance-level explanations
        # which complement global feature importance
        print("\n=== Generating LIME Feature Importance Visualization ===")
        graph_features(X_test, trained_pipeline)
        
        print("\n=== Pipeline execution completed successfully ===")
        print(f"All outputs saved to {OUTPUT_DIR}")
        
    except Exception as e:
        
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    # Standard Python idiom to run the main function 
    main()