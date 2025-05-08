# flake8: noqa

from flask import Flask, request, jsonify
import onnxruntime as ort
import numpy as np
import os
import pickle
import traceback
import psycopg2
import psycopg2.extras
from google import genai
from google.genai import types
import threading
import sys
import types as python_types

# Flask Application
app = Flask(__name__)

# Hardcoded database connection info
DB_NAME = "desd"
DB_USER = "postgres"
DB_PASSWORD = "password"
DB_HOST = "docker-postgres-db-1"
DB_PORT = "5432"

# Global variables for active model and preprocessor
active_model = None
active_preprocessor = None
active_model_record = None
MODEL_TYPE = None
MODEL_FILENAME = None
GENAI_MODEL_NAME = "gemini-2.5-pro-exp-03-25"
input_name = None
output_name = None
active_model_id = None
model_lock = threading.Lock()  # Lock for thread safety

def get_db_connection():
    """Create a database connection"""
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    return conn

def get_active_model_from_db():
    """Get the active model record from database"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        # Query to find active model
        cursor.execute('SELECT * FROM "Models" WHERE is_active = TRUE ORDER BY model_version DESC LIMIT 1')
        model = cursor.fetchone()

        if not model:
            raise ValueError("No active model found in database")

        return dict(model)
    finally:
        cursor.close()
        conn.close()

# Import all potential preprocessors here
try:
    from settlement_preprocessor import SettlementInputPreprocessor
    from type1preprocessor import SettlementInputPreprocessor2  # Example of another preprocessor
except ImportError as e:
    print(f"Error importing preprocessors: {e}")
    # Create placeholder classes if imports fail
    class SettlementInputPreprocessor:
        def __init__(self, *args, **kwargs):
            print("Using placeholder SettlementInputPreprocessor")

        def preprocess_input(self, data):
            return np.array([[0.0]])

        def inverse_transform_target(self, val):
            return 0.0

    class SettlementInputPreprocessor2(SettlementInputPreprocessor):
        pass

def load_active_model():
    """
    Load the active model and preprocessor from the database.
    """
    global active_model, active_preprocessor, active_model_record, MODEL_TYPE, MODEL_FILENAME, input_name, output_name, active_model_id

    # Use a lock to prevent concurrent reloading
    with model_lock:
        # Find active model from database
        try:
            # Get previous model info for logging
            old_model_id = active_model_id
            old_model_filename = MODEL_FILENAME

            # Query the database for the active model
            active_model_record = get_active_model_from_db()

            if not active_model_record:
                raise ValueError("No active model found in database")

            # Store the model ID for logging
            active_model_id = active_model_record["model_id"]

            print(f"Loading active model: {active_model_record['model_name']} v{active_model_record['model_version']}")
            print(f"Model ID: {active_model_id} (previous: {old_model_id})")

            # Determine model type based on file extension
            model_file_path = active_model_record["model_file"]
            if model_file_path.lower().endswith('.onnx'):
                MODEL_TYPE = "ONNX"
            elif model_file_path.lower().endswith('.pkl') or model_file_path.lower().endswith('.pickle'):
                MODEL_TYPE = "PICKLE"
            else:
                # Default to ONNX if can't determine
                MODEL_TYPE = "ONNX"
                print(f"Warning: Could not determine model type from file extension. Defaulting to {MODEL_TYPE}")

            MODEL_FILENAME = os.path.basename(model_file_path)
            if old_model_filename != MODEL_FILENAME:
                print(f"Model file changed: {old_model_filename} -> {MODEL_FILENAME}")

            # Load model
            if not os.path.isabs(model_file_path):
                model_file_path = os.path.join(os.path.dirname(__file__), model_file_path)

            print(f"Loading model from {model_file_path}...")

            # Load based on model type
            if MODEL_TYPE.upper() == "ONNX":
                try:
                    active_model = ort.InferenceSession(model_file_path)
                    # Get input/output names for ONNX
                    input_name = active_model.get_inputs()[0].name
                    output_name = active_model.get_outputs()[0].name
                    print(f"Model input name: {input_name}")
                    print(f"Model output name: {output_name}")
                except Exception as e:
                    print(f"Error loading ONNX model: {e}")
                    traceback.print_exc()
                    raise
            elif MODEL_TYPE.upper() == "PICKLE":
                try:
                    # Create mock modules to satisfy potential imports
                    for module_name in ['models', 'models.types']:
                        if module_name not in sys.modules:
                            mock_module = python_types.ModuleType(module_name)
                            sys.modules[module_name] = mock_module
                            print(f"Created mock module: {module_name}")

                    # Now try to load the pickle file
                    with open(model_file_path, 'rb') as model_file:
                        active_model = pickle.load(model_file)

                    # For pickle models, we don't need input/output names
                    input_name = None
                    output_name = None
                    print(f"Loaded pickle model with type: {type(active_model)}")
                except Exception as e:
                    print(f"Error with standard pickle loading: {e}")

                    # Try with custom unpickler as fallback
                    try:
                        class CustomUnpickler(pickle.Unpickler):
                            def find_class(self, module, name):
                                # Handle missing modules
                                if module.startswith('models.'):
                                    # Return a dummy class
                                    return type(name, (), {})
                                return super().find_class(module, name)

                        with open(model_file_path, 'rb') as model_file:
                            active_model = CustomUnpickler(model_file).load()

                        print(f"Successfully loaded pickle model with custom unpickler: {type(active_model)}")
                    except Exception as inner_e:
                        print(f"Failed to load with custom unpickler: {inner_e}")
                        traceback.print_exc()
                        raise
            else:
                raise ValueError(f"Unsupported model type: {MODEL_TYPE}")

            # Get preprocessor class name from the database
            preprocessor_class_name = active_model_record["label_encoder_file"]
            print(f"Preprocessor class name from database: {preprocessor_class_name}")

            # Choose the appropriate preprocessor class based on the name
            if preprocessor_class_name == "SettlementInputPreprocessor":
                preprocessor_class = SettlementInputPreprocessor
            elif preprocessor_class_name == "SettlementInputPreprocessor2":
                preprocessor_class = SettlementInputPreprocessor2
            else:
                # Default to SettlementInputPreprocessor if unknown
                print(f"Warning: Unknown preprocessor class name: {preprocessor_class_name}. Defaulting to SettlementInputPreprocessor")
                preprocessor_class = SettlementInputPreprocessor

            print(f"Using preprocessor class: {preprocessor_class.__name__}")

            # Initialize the preprocessor WITHOUT any parameters
            try:
                active_preprocessor = preprocessor_class()
                print(f"Preprocessor initialized: {active_preprocessor}")

            except Exception as e:
                print(f"Error initializing preprocessor {preprocessor_class.__name__}: {e}")
                traceback.print_exc()
                raise

        except Exception as e:
            print(f"Error finding active model: {e}")
            traceback.print_exc()
            raise

# Initialize by loading the active model and preprocessor
try:
    load_active_model()
except Exception as e:
    print(f"Error during initialization: {e}")
    traceback.print_exc()
    # Set default values for global variables to prevent further errors
    MODEL_TYPE = "UNKNOWN"
    MODEL_FILENAME = "NONE"
    active_model_id = None

def generate(settlement_amount):
    """
    Generate an explanation for the prediction using Gemini API.
    """
    client = genai.Client(
        api_key="AIzaSyCQP5waAqmAQcxfa-sdzOBzYahBD21jKps",
    )

    print(f"Using Gemini model: {GENAI_MODEL_NAME}")

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=f"Settlement Amount: {settlement_amount}\n"
                )
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(
                text="Based on the settlement amount given, give a possible " +
                     "reason why that settlement amount was chosen"
            ),
        ],
    )

    generated_response = ""
    for chunk in client.models.generate_content_stream(
        model=GENAI_MODEL_NAME,
        contents=contents,
        config=generate_content_config,
    ):
        generated_response += chunk.text

    return generated_response

@app.route('/predict', methods=['POST'])
def predict_settlement():
    """
    Handle prediction requests and return settlement predictions with explanations.
    Always reload the model before prediction to ensure the latest model is used.
    """
    try:
        # Always reload the model before each prediction
        print("Reloading model before prediction")
        load_active_model()

        # Check if model was loaded successfully
        if active_model is None:
            return jsonify({
                "error": "Model is not available",
                "model_info": {
                    "ml_model": MODEL_FILENAME if MODEL_FILENAME else "NONE",
                    "ml_model_type": MODEL_TYPE if MODEL_TYPE else "UNKNOWN",
                    "genai_model": GENAI_MODEL_NAME
                }
            }), 500

        input_data = request.json
        print(f"Received input data: {input_data}")

        # Process the input data using our active preprocessor
        processed_features = active_preprocessor.preprocess_input(input_data)

        # Make prediction based on model type
        if MODEL_TYPE and MODEL_TYPE.upper() == "ONNX":
            # Check if we have the correct number of features for ONNX
            expected_features = active_model.get_inputs()[0].shape[1]
            if processed_features.shape[1] != expected_features:
                print(f"Warning: Model expects {expected_features} features, got {processed_features.shape[1]}")
                return jsonify({
                    "error": f"Feature dimension mismatch. Expected {expected_features}, got {processed_features.shape[1]}",
                    "model_info": {
                        "ml_model": MODEL_FILENAME,
                        "ml_model_type": MODEL_TYPE,
                        "genai_model": GENAI_MODEL_NAME
                    }
                }), 400

            # Run prediction through ONNX
            prediction = active_model.run([output_name], {input_name: processed_features.astype(np.float32)})[0]
            prediction_value = float(prediction[0])  # Convert first element to Python float

        elif MODEL_TYPE and MODEL_TYPE.upper() == "PICKLE":
            # For pickle models, use the predict method directly
            try:
                # Different scikit-learn models might have different predict methods
                if hasattr(active_model, 'predict'):
                    prediction = active_model.predict(processed_features)
                    prediction_value = float(prediction[0])
                elif hasattr(active_model, 'predict_proba'):
                    # For classifiers that output probabilities
                    probs = active_model.predict_proba(processed_features)
                    prediction_value = float(probs[0][1])  # Assuming binary classification, take probability of class 1
                else:
                    raise ValueError(f"Model does not have standard predict methods")
            except Exception as e:
                print(f"Error making prediction with pickle model: {e}")
                return jsonify({
                    "error": f"Prediction error: {str(e)}",
                    "model_info": {
                        "ml_model": MODEL_FILENAME,
                        "ml_model_type": MODEL_TYPE,
                        "genai_model": GENAI_MODEL_NAME
                    }
                }), 500
        else:
            raise ValueError(f"Unsupported model type: {MODEL_TYPE}")

        # Transform prediction value using preprocessor
        final_prediction = float(active_preprocessor.inverse_transform_target(prediction_value))

        print(f"Raw prediction: {prediction_value}, Final prediction: {final_prediction}")

        # Generate explanation
        generated_reason = generate(final_prediction)

        # Prepare response
        response_data = {
            "predicted_amount": f"£{final_prediction:.2f}",
            "generated_reason": generated_reason,
            "model_info": {
                "ml_model": MODEL_FILENAME,
                "ml_model_type": MODEL_TYPE,
                "genai_model": GENAI_MODEL_NAME,
                "model_id": str(active_model_id)
            }
        }

        return jsonify(response_data)

    except (ValueError, KeyError, TypeError) as e:
        print(f"Validation error: {str(e)}")
        return jsonify({
            "error": str(e),
            "model_info": {
                "ml_model": MODEL_FILENAME if MODEL_FILENAME else "NONE",
                "ml_model_type": MODEL_TYPE if MODEL_TYPE else "UNKNOWN",
                "genai_model": GENAI_MODEL_NAME
            }
        }), 400
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": "An error occurred: " + str(e),
            "model_info": {
                "ml_model": MODEL_FILENAME if MODEL_FILENAME else "NONE",
                "ml_model_type": MODEL_TYPE if MODEL_TYPE else "UNKNOWN",
                "genai_model": GENAI_MODEL_NAME
            }
        }), 500

if __name__ == '__main__':
    print("\n=== MODEL INFORMATION ===")
    print(f"ML Model Type: {MODEL_TYPE if MODEL_TYPE is not None else 'UNKNOWN'}")
    print(f"ML Model Filename: {MODEL_FILENAME}")
    print(f"Model ID: {active_model_id}")
    print(f"Reload strategy: Always reload before each prediction")

    # Print input shape if ONNX model
    if MODEL_TYPE is not None and MODEL_TYPE.upper() == "ONNX" and active_model:
        print(f"Input Shape: {active_model.get_inputs()[0].shape}")
    elif MODEL_TYPE is not None and MODEL_TYPE.upper() == "PICKLE" and active_model:
        print(f"Model Class: {type(active_model).__name__}")
        if hasattr(active_model, 'n_features_in_'):
            print(f"Features: {active_model.n_features_in_}")

    # Print expected features if available
    if active_preprocessor is not None and hasattr(active_preprocessor, 'expected_feature_count'):
        print(f"Expected Features: {active_preprocessor.expected_feature_count}")

    print(f"Gemini Model: {GENAI_MODEL_NAME}")
    print("=========================\n")

    app.run(host='0.0.0.0', port=5000, debug=False)