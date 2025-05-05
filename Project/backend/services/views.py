"""
Views for proxying requests to external services.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from function.services_proxy import call_ml_service
from function.monitoring.middleware import api_user_agent


@api_user_agent("User has requested a settlement amount prediction.")
@api_view(['POST'])
@permission_classes([AllowAny])
def predict(request):
    """
    Proxy the prediction request to the ML service.
    """
    return call_ml_service('predict', request.data)
