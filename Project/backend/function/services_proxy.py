"""
Proxy module for communicating with microservices.
"""

import os
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response


def call_ml_service(endpoint, data):
    """
    Send a request to the ML service and return the response.
    """
    # Get the ML service URL from settings or environment variable
    ml_service_url = getattr(settings, 'ML_SERVICE_URL',
                           os.environ.get('ML_SERVICE_URL',
                                            'http://ml-service:5000'))

    # Construct the full URL
    url = f"{ml_service_url}/{endpoint.lstrip('/')}"

    try:
        # Send the request to the ML service
        response = requests.post(url, json=data, timeout=30)
        
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
