# service_proxy.py
# flake8: noqa
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response

def call_ml_service(endpoint, data):
    """
    Send a request to the ML service and return the response.
    """

    clean_endpoint = endpoint.strip('/')

    # Construct the full URL
    url = f"{settings.ML_SERVICE_URL}/{clean_endpoint}"

    try:
        # Send the request to the ML service
        response = requests.post(url, json=data, timeout=900)

        # Return the response with appropriate status code
        return Response(
            response.json(),
            status=response.status_code
        )
    except requests.RequestException as e:
        # Handle connection errors
        return Response(
            {"error": f"Failed to connect to ML service: {str(e)}"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
