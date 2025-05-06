# flake8: noqa
from rest_framework.decorators import api_view
from .services_proxy import call_ml_service

@api_view(['POST'])
def predict(request):
    """
    Handle prediction requests and forward to ML service.
    """
    # Extract data from request
    data = request.data
    
    # Call the ML service through the proxy
    return call_ml_service('predict', data)