"""
This module provides a simple Flask service for predicting settlement amounts
using a pre-trained machine learning model. It also generates explanations
for the predictions using LIME and a generative AI model.
"""
# flake8: noqa
import os
import joblib
import numpy as np
from google import genai
from google.genai import types
from flask import Flask, request, jsonify
import lime
import lime.lime_tabular
import datetime

app = Flask(__name__)

# Disable automatic redirects for trailing slashes
app.url_map.strict_slashes = True

# Load the model and label encoders once when the server starts
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    'random_forest_model.pkl'
)
LABEL_ENCODERS_PATH = os.path.join(
    os.path.dirname(__file__),
    'label_encoders.pkl'
)
TRAINING_DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    'training_data.pkl'
)

print(f"Loading model from {MODEL_PATH}...")
model = joblib.load(MODEL_PATH)
print("Model loaded successfully.")

print(f"Loading label encoders from {LABEL_ENCODERS_PATH}...")
label_encoders = joblib.load(LABEL_ENCODERS_PATH)
print("Label encoders loaded successfully.")

print(f"Loading training data from {TRAINING_DATA_PATH}...")
training_data = joblib.load(TRAINING_DATA_PATH)
print("Training data loaded successfully.")


def preprocess_value(feature, value):
    """
    Preprocess input values based on their feature type.
    """
    if feature in ["Accident Date", "Claim Date"]:
        try:
            dt = datetime.datetime.strptime(value, "%d/%m/%Y %H:%M:%S")
            return (dt - datetime.datetime(1970, 1, 1)).total_seconds() / (
                24 * 3600
            )
        except ValueError as exc:
            raise ValueError(
                f"Invalid date format for {feature}. "
                f"Expected format: 'DD/MM/YYYY HH:MM:SS'"
            ) from exc

    elif feature in [
        "Police Report Filed", "Witness Present", "Whiplash",
        "Exceptional_Circumstances", "Minor_Psychological_Injury"
    ]:
        return 1 if value in ["Yes", True, "true", "yes"] else 0
    elif feature in [
        "SpecialHealthExpenses", "SpecialReduction", "SpecialOverage",
        "GeneralRest", "SpecialAdditionalInjury", "SpecialEarningsLoss",
        "SpecialUsageLoss", "SpecialMedications", "SpecialAssetDamage",
        "SpecialRehabilitation", "SpecialFixes", "GeneralFixed",
        "GeneralUplift", "SpecialLoanerVehicle", "SpecialTripCosts",
        "SpecialJourneyExpenses", "SpecialTherapy", "Vehicle Age",
        "Driver Age", "Number of Passengers"
    ]:
        return float(value)
    elif feature in label_encoders:
        return label_encoders[feature].transform([value])[0]
    else:
        return value


def generate(settlement_amount, lime_explanation):
    """
    Generate an explanation for the prediction using Gemini API.
    """
    client = genai.Client(
        api_key="AIzaSyCQP5waAqmAQcxfa-sdzOBzYahBD21jKps",
    )

    genai_model = "gemini-2.5-pro-exp-03-25"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=f"Settlement Amount: {settlement_amount}\n"
                         f"LIME Explanation: {lime_explanation}"
                )
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(
                text="using the features and values given, the settlement " +
                     "amount given and the LIME explanations, " +
                     "give a reason why that settlement amount was chosen"
            ),
        ],
    )

    generated_response = ""
    for chunk in client.models.generate_content_stream(
        model=genai_model,
        contents=contents,
        config=generate_content_config,
    ):
        generated_response += chunk.text

    return generated_response


# Important: Flask routes must start with a slash
@app.route('/predict', methods=['POST'])
def predict_settlement():
    """
    Handle prediction requests and return settlement predictions with explanations.
    """
    try:
        input_data = request.json
        features = training_data.columns.tolist()

        transformed_data = [
            preprocess_value(feature, input_data.get(feature, None))
            for feature in features
        ]
        transformed_data = np.array(transformed_data).reshape(1, -1)

        prediction = model.predict(transformed_data)[0]

        # Proper LIME Explanation using real training data
        explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=training_data.values,
            feature_names=features,
            mode='regression',
        )
        exp = explainer.explain_instance(transformed_data[0], model.predict)

        explanation = {feature: weight for feature, weight in exp.as_list()}

        # Call the Gemini API to generate a reason for the settlement amount
        generated_reason = generate(prediction, explanation)

        return jsonify({
            "predicted_amount": f"£{prediction:.2f}",
            "explanation": explanation,
            "generated_reason": generated_reason,
        })
    except (ValueError, KeyError, TypeError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred: " + str(e)}), 500


# This function is added for Django import compatibility
def predict():
    """
    Proxy function for Django import compatibility.
    This allows 'from services.machinelearning.app import predict' to work.
    """
    return predict_settlement


@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify the service is running."""
    return jsonify({"status": "healthy", "service": "ml-prediction"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)