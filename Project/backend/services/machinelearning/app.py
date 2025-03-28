from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pickle
import shap
import pandas as pd
import os
import requests
from django.db import connection

model = None

# Hardcoded path to the model file
MODEL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'random_forest.pt')

def load_model():
    global model
    try:
        # Load the hardcoded model file
        with open(MODEL_FILE, 'rb') as f:
            model = pickle.load(f)
            print(f"Model loaded: {MODEL_FILE}")
    except FileNotFoundError:
        print(f"Model file not found: {MODEL_FILE}")
    except Exception as e:
        print(f"Error loading model: {e}")

# Load the model at startup
load_model()

@csrf_exempt
def predict(request):
    if model is None:
        return JsonResponse({'error': 'No model loaded'}, status=500)

    try:
        # Parse the input JSON data
        data = request.json()
        df = pd.DataFrame([data])

        # Make a prediction
        prediction = model.predict(df)

        # Generate SHAP explanation
        explainer = shap.Explainer(model, df)
        shap_values = explainer(df)
        explanation = shap.plots.force(shap_values[0]).data

        # Calculate settlement amount
        settlement_amount = prediction[0] * 1000

        # Update model statistics
        update_model_statistics(prediction[0])

        # Generate a summary
        summary = generate_summary(settlement_amount, explanation)

        # Return the response
        return JsonResponse({
            'prediction': prediction.tolist(),
            'settlement_amount': settlement_amount,
            'explanation': explanation,
            'summary': summary
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def update_model_statistics(prediction):
    try:
        with connection.cursor() as cur:
            if prediction > 0.5:
                cur.execute("""
                    UPDATE Models SET num_accepted_claims = num_accepted_claims + 1
                    WHERE is_active = TRUE
                """)
            else:
                cur.execute("""
                    UPDATE Models SET num_rejected_claims = num_rejected_claims + 1
                    WHERE is_active = TRUE
                """)
            connection.commit()
    except Exception as e:
        print(f"Error updating model statistics: {e}")

def generate_summary(settlement_amount, explanation):
    try:
        response = requests.post('https://api.generativeai.com/summarize', json={
            'settlement_amount': settlement_amount,
            'explanation': explanation
        })
        if response.status_code == 200:
            return response.json().get('summary', 'No summary available')
        return 'Error generating summary'
    except Exception as e:
        return f'Error: {str(e)}'