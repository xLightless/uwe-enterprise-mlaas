"""
This module provides a Django view for predicting settlement amounts
using a pre-trained machine learning model. It also generates explanations
for the predictions using LIME and a generative AI model.
"""

import os
import joblib
import numpy as np
from google import genai
from google.genai import types
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import lime
import lime.lime_tabular
from rest_framework import status
import datetime

# Load the model and label encoders once when the server starts
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    'random_forest_model.pkl'
)
LABEL_ENCODERS_PATH = os.path.join(
    os.path.dirname(__file__),
    'label_encoders.pkl'
)

model = joblib.load(MODEL_PATH)
label_encoders = joblib.load(LABEL_ENCODERS_PATH)

# Load real training data for LIME explanation
TRAINING_DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    'training_data.pkl'
)
training_data = joblib.load(TRAINING_DATA_PATH)  # Load actual training data


def preprocess_value(feature, value):
    """
    Preprocesses a given feature value based on its type.

    Args:
        feature (str): The name of the feature to preprocess.
        value (any): The value of the feature to preprocess.

    Returns:
        any: The preprocessed value, converted to the appropriate
        type or format.
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


@api_view(['POST'])
@permission_classes([AllowAny])
def predict(request):
    try:
        input_data = request.data
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

        return Response(
            {
                "predicted_amount": f"£{prediction:.2f}",
                "explanation": explanation,
                "generated_reason": generated_reason,
            },
            status=status.HTTP_200_OK,
        )
    except (ValueError, KeyError, TypeError) as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except joblib.externals.loky.process_executor.TerminatedWorkerError as e:
        return Response(
            {"error": "Model processing error: " + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        return Response(
            {"error": "An unexpected error occurred: " + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
