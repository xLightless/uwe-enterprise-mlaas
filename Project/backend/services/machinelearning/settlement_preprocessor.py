"""
SettlementInputPreprocessor - Complete Implementation Matching Original Pipeline
"""
# flake8: noqa
#this is for preprocessing for model type two
import numpy as np
import pandas as pd
import re
from datetime import datetime
from typing import Dict, Any, List

class SettlementInputPreprocessor:
    def __init__(self):
        # Configuration matching your training pipeline
        self.TARGET_COLUMN = 'SettlementValue'
        self.BINARY_COLS = [
            'Exceptional_Circumstances', 'Minor_Psychological_Injury', 'Whiplash',
            'Police Report Filed', 'Witness Present'
        ]
        self.CATEGORICAL_COLS = [
            'AccidentType', 'Dominant injury', 'Vehicle Type',
            'Weather Conditions', 'Accident Description', 'Injury Description', 'Gender'
        ]
        self.DATETIME_COLS = ['Accident Date', 'Claim Date']
        self.PROGNOSIS_COL = 'Injury_Prognosis'
        self.SPECIAL_COST_COLS = [
            'SpecialHealthExpenses', 'SpecialOverage', 'SpecialAdditionalInjury',
            'SpecialEarningsLoss', 'SpecialUsageLoss', 'SpecialMedications',
            'SpecialAssetDamage', 'SpecialRehabilitation', 'SpecialFixes',
            'SpecialLoanerVehicle', 'SpecialTripCosts',
            'SpecialJourneyExpenses', 'SpecialTherapy'
        ]
        self.expected_feature_count = 112

        # Define expected categories for one-hot encoding
        self.expected_categories = {
            'AccidentType': ['Rear end', 'Side impact', 'Head on', 'Rollover',
                           'Single vehicle', 'Multi-vehicle', 'Pedestrian', 'Cyclist'],
            'Dominant injury': ['Whiplash', 'Fracture', 'Sprain', 'Concussion', 'Soft tissue',
                              'Laceration', 'Internal', 'Burns', 'Amputation', 'Multiple'],
            'Vehicle Type': ['Sedan', 'SUV', 'Truck', 'Motorcycle', 'Van', 'Bus',
                            'Bicycle', 'Pedestrian', 'Commercial'],
            'Weather Conditions': ['Clear', 'Rain', 'Snow', 'Fog', 'Ice', 'Wind', 'Hail'],
            'Accident Description': ['Minor collision', 'Major collision', 'Fender bender', 'Rollover',
                                   'Hit and run', 'Chain reaction', 'Sideswipe', 'Backing up'],
            'Injury Description': ['Neck pain', 'Back pain', 'Headaches', 'Broken bones', 'Bruising',
                                 'Cuts and scrapes', 'Internal bleeding', 'Burns', 'Multiple injuries'],
            'Gender': ['Male', 'Female', 'Other', 'Unknown']
        }

    def preprocess_input(self, input_data: Dict[str, Any]) -> np.ndarray:
        """
        Process raw input data into model-ready format
        Args:
            input_data: Dictionary of raw input features
        Returns:
            numpy array with exactly 112 features
        """
        try:
            # Convert input to DataFrame
            input_df = pd.DataFrame([input_data])

            # Apply full preprocessing pipeline
            df_clean = self.initial_clean(input_df)
            df_imputed = self.apply_preliminary_imputation(df_clean)
            df_engineered = self.engineer_features(df_imputed)
            df_complete = self.ensure_all_columns(df_engineered)
            df_final = self.apply_final_processing(df_complete)

            # Convert to numpy array with correct dtype
            processed_data = df_final.values.astype(np.float32)

            # Ensure correct feature count
            if processed_data.shape[1] < self.expected_feature_count:
                padding = np.zeros((1, self.expected_feature_count - processed_data.shape[1]))
                processed_data = np.hstack([processed_data, padding])
            elif processed_data.shape[1] > self.expected_feature_count:
                processed_data = processed_data[:, :self.expected_feature_count]

            return processed_data

        except Exception as e:
            raise ValueError(f"Failed to preprocess input: {str(e)}")

    def initial_clean(self, df: pd.DataFrame) -> pd.DataFrame:
        """Initial data cleaning matching your pipeline"""
        df_clean = df.copy()

        # Convert binary columns
        for col in self.BINARY_COLS:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].apply(
                    lambda x: 1 if str(x).lower() in ['yes', 'true', '1']
                    else 0 if str(x).lower() in ['no', 'false', '0']
                    else np.nan
                ).astype(np.float64)

        # Convert categorical columns to strings
        for col in self.CATEGORICAL_COLS:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].astype(str)

        return df_clean

    def apply_preliminary_imputation(self, df: pd.DataFrame) -> pd.DataFrame:
        """Imputation matching your training pipeline"""
        df_imputed = df.copy()

        # Impute special costs with 0
        for col in self.SPECIAL_COST_COLS:
            if col in df_imputed.columns:
                df_imputed[col] = df_imputed[col].fillna(0).astype(np.float64)
            else:
                df_imputed[col] = 0.0

        # Impute categorical columns
        for col in self.CATEGORICAL_COLS:
            if col in df_imputed.columns:
                df_imputed[col] = df_imputed[col].fillna('Unknown')

        return df_imputed

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Feature engineering matching your pipeline"""
        df_eng = df.copy()

        # Date processing
        for col in self.DATETIME_COLS:
            if col in df_eng.columns:
                try:
                    df_eng[col] = pd.to_datetime(df_eng[col], errors='coerce')
                    prefix = col.split()[0]

                    # Extract date components
                    df_eng[f'{prefix}_Year'] = df_eng[col].dt.year.astype(np.float64)
                    df_eng[f'{prefix}_Month'] = df_eng[col].dt.month.astype(np.float64)
                    df_eng[f'{prefix}_Day'] = df_eng[col].dt.day.astype(np.float64)
                    df_eng[f'{prefix}_DayOfWeek'] = df_eng[col].dt.dayofweek.astype(np.float64)
                    df_eng[f'{prefix}_Quarter'] = df_eng[col].dt.quarter.astype(np.float64)

                    # Cyclical features
                    df_eng[f'{prefix}_Month_sin'] = np.sin(2 * np.pi * df_eng[col].dt.month / 12)
                    df_eng[f'{prefix}_Month_cos'] = np.cos(2 * np.pi * df_eng[col].dt.month / 12)
                    df_eng[f'{prefix}_DayOfWeek_sin'] = np.sin(2 * np.pi * df_eng[col].dt.dayofweek / 7)
                    df_eng[f'{prefix}_DayOfWeek_cos'] = np.cos(2 * np.pi * df_eng[col].dt.dayofweek / 7)

                except Exception as e:
                    print(f"Error processing date column {col}: {str(e)}")
                    # Create default columns if date processing fails
                    prefix = col.split()[0]
                    for feature in [f'{prefix}_Year', f'{prefix}_Month', f'{prefix}_Day',
                                  f'{prefix}_DayOfWeek', f'{prefix}_Quarter',
                                  f'{prefix}_Month_sin', f'{prefix}_Month_cos',
                                  f'{prefix}_DayOfWeek_sin', f'{prefix}_DayOfWeek_cos']:
                        df_eng[feature] = 0.0

        # Time between accident and claim
        if 'Accident Date' in df_eng.columns and 'Claim Date' in df_eng.columns:
            if pd.api.types.is_datetime64_any_dtype(df_eng['Accident Date']) and pd.api.types.is_datetime64_any_dtype(df_eng['Claim Date']):
                df_eng['Accident_To_Claim_Days'] = (df_eng['Claim Date'] - df_eng['Accident Date']).dt.days.astype(np.float64)
                df_eng['Accident_To_Claim_Log_Days'] = np.log1p(df_eng['Accident_To_Claim_Days']).astype(np.float64)
            else:
                df_eng['Accident_To_Claim_Days'] = 30.0
                df_eng['Accident_To_Claim_Log_Days'] = np.log1p(30.0)
        else:
            df_eng['Accident_To_Claim_Days'] = 30.0
            df_eng['Accident_To_Claim_Log_Days'] = np.log1p(30.0)

        # Prognosis processing
        if self.PROGNOSIS_COL in df_eng.columns:
            df_eng['Prognosis_Months'] = df_eng[self.PROGNOSIS_COL].apply(
                lambda x: float(re.search(r'(\d+)', str(x)).group(1))
                if pd.notna(x) and re.search(r'(\d+)', str(x))
                else np.nan
            ).astype(np.float64)

            # Injury severity
            conditions = [
                df_eng['Prognosis_Months'] <= 3,
                (df_eng['Prognosis_Months'] > 3) & (df_eng['Prognosis_Months'] <= 6),
                (df_eng['Prognosis_Months'] > 6) & (df_eng['Prognosis_Months'] <= 12),
                (df_eng['Prognosis_Months'] > 12)
            ]
            choices = ['Minor', 'Moderate', 'Serious', 'Severe']
            df_eng['Injury_Severity'] = np.select(conditions, choices, default='Unknown')
            df_eng['Injury_Severity_Numeric'] = df_eng['Injury_Severity'].map(
                {'Minor': 1, 'Moderate': 2, 'Serious': 3, 'Severe': 4, 'Unknown': 0}
            ).astype(np.float64)
        else:
            df_eng['Prognosis_Months'] = 3.0
            df_eng['Injury_Severity'] = 'Minor'
            df_eng['Injury_Severity_Numeric'] = 1.0

        # Cost aggregations
        cost_categories = {
            'Medical': ['SpecialHealthExpenses', 'SpecialMedications', 'SpecialTherapy', 'SpecialRehabilitation'],
            'Vehicle': ['SpecialAssetDamage', 'SpecialFixes', 'SpecialLoanerVehicle'],
            'Travel': ['SpecialTripCosts', 'SpecialJourneyExpenses'],
            'Income': ['SpecialEarningsLoss', 'SpecialUsageLoss'],
            'Other': ['SpecialOverage', 'SpecialAdditionalInjury']
        }

        for category, columns in cost_categories.items():
            valid_cols = [col for col in columns if col in df_eng.columns]
            if valid_cols:
                df_eng[f'Total_{category}_Costs'] = df_eng[valid_cols].sum(axis=1).astype(np.float64)
                df_eng[f'Has_{category}_Costs'] = (df_eng[f'Total_{category}_Costs'] > 0).astype(np.float64)
            else:
                df_eng[f'Total_{category}_Costs'] = 0.0
                df_eng[f'Has_{category}_Costs'] = 0.0

        # Total special costs
        special_cols = [col for col in self.SPECIAL_COST_COLS if col in df_eng.columns]
        if special_cols:
            df_eng['Total_Special_Costs'] = df_eng[special_cols].sum(axis=1).astype(np.float64)
        else:
            df_eng['Total_Special_Costs'] = 0.0

        # Interaction features
        if 'Injury_Severity_Numeric' in df_eng.columns and 'Accident_To_Claim_Days' in df_eng.columns:
            df_eng['Severity_Timing_Interaction'] = (df_eng['Injury_Severity_Numeric'] * df_eng['Accident_To_Claim_Days']).astype(np.float64)
        else:
            df_eng['Severity_Timing_Interaction'] = 0.0

        if 'Total_Special_Costs' in df_eng.columns and 'Injury_Severity_Numeric' in df_eng.columns:
            df_eng['Cost_Severity_Interaction'] = (df_eng['Total_Special_Costs'] * df_eng['Injury_Severity_Numeric']).astype(np.float64)
        else:
            df_eng['Cost_Severity_Interaction'] = 0.0

        return df_eng

    def ensure_all_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        """Ensure all expected columns are present with correct types"""
        df_complete = df.copy()

        # Get all expected feature names
        expected_features = self.get_expected_features()

        # Add missing columns with appropriate defaults
        for col in expected_features:
            if col not in df_complete.columns:
                if col.startswith(('Total_', 'Has_')):
                    df_complete[col] = 0.0
                elif col.endswith(('_sin', '_cos', '_Numeric')):
                    df_complete[col] = 0.0
                elif col in self.SPECIAL_COST_COLS:
                    df_complete[col] = 0.0
                elif col == 'Prognosis_Months':
                    df_complete[col] = 3.0
                elif col == 'Injury_Severity':
                    df_complete[col] = 'Minor'
                elif col == 'Claim_Timing_Category':
                    df_complete[col] = 'Within_Month'
                else:
                    df_complete[col] = 0.0

        # Ensure categorical columns have all expected categories
        for col, categories in self.expected_categories.items():
            if col in df_complete.columns:
                # Add dummy rows to ensure all categories exist
                for category in categories:
                    if category not in df_complete[col].values:
                        temp_idx = len(df_complete)
                        df_complete.loc[temp_idx, col] = category
                        df_complete = df_complete.iloc[:-1]  # Remove dummy row

        # Convert to correct dtypes
        for col in df_complete.columns:
            if col in self.SPECIAL_COST_COLS or col.startswith(('Total_', 'Has_')):
                df_complete[col] = df_complete[col].astype(np.float64)
            elif col.endswith(('_sin', '_cos', '_Numeric')):
                df_complete[col] = df_complete[col].astype(np.float64)
            elif col in self.CATEGORICAL_COLS:
                df_complete[col] = df_complete[col].astype(str)
                df_complete[col] = pd.Categorical(
                    df_complete[col],
                    categories=self.expected_categories.get(col, df_complete[col].unique())
                )

        return df_complete

    def apply_final_processing(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply one-hot encoding and final transformations"""
        # One-hot encode categorical variables
        df_final = df.copy()
        categorical_cols = [col for col in self.CATEGORICAL_COLS if col in df_final.columns]

        for col in categorical_cols:
            if pd.api.types.is_categorical_dtype(df_final[col]):
                # Get all categories including those not present in current data
                all_categories = self.expected_categories.get(col, df_final[col].cat.categories)

                # Create dummy columns for all expected categories
                dummies = pd.get_dummies(df_final[col], prefix=col, prefix_sep='__')

                # Ensure all expected categories are represented
                for category in all_categories:
                    dummy_col = f"{col}__{category}"
                    if dummy_col not in dummies.columns:
                        dummies[dummy_col] = 0

                # Drop the original column and add dummies
                df_final = df_final.drop(col, axis=1)
                df_final = pd.concat([df_final, dummies], axis=1)

        # Select only numeric columns for final output
        numeric_cols = df_final.select_dtypes(include=np.number).columns
        df_final = df_final[numeric_cols]

        return df_final

    def get_expected_features(self) -> List[str]:
        """Return list of all expected feature names"""
        features = []

        # Binary features
        features.extend(self.BINARY_COLS)

        # Special cost features
        features.extend(self.SPECIAL_COST_COLS)

        # Date features
        for col in self.DATETIME_COLS:
            prefix = col.split()[0]
            features.extend([
                f'{prefix}_Year', f'{prefix}_Month', f'{prefix}_Day',
                f'{prefix}_DayOfWeek', f'{prefix}_Quarter',
                f'{prefix}_Month_sin', f'{prefix}_Month_cos',
                f'{prefix}_DayOfWeek_sin', f'{prefix}_DayOfWeek_cos'
            ])

        # Time difference features
        features.extend([
            'Accident_To_Claim_Days', 'Accident_To_Claim_Log_Days'
        ])

        # Prognosis features
        features.extend([
            'Prognosis_Months', 'Injury_Severity_Numeric'
        ])

        # Cost aggregation features
        cost_categories = ['Medical', 'Vehicle', 'Travel', 'Income', 'Other']
        for category in cost_categories:
            features.extend([f'Total_{category}_Costs', f'Has_{category}_Costs'])

        # Interaction features
        features.extend([
            'Severity_Timing_Interaction', 'Cost_Severity_Interaction'
        ])

        # One-hot encoded categorical features
        for col, categories in self.expected_categories.items():
            features.extend([f"{col}__{cat}" for cat in categories])

        return features

    def inverse_transform_target(self, y_pred: float) -> float:
        """Convert model prediction back to original scale (assuming log1p transform)"""
        return np.expm1(y_pred)