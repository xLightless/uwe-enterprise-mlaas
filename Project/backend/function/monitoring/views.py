"""
Monitoring views for the function app.
"""

from function.models import ActivityLog
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from function.monitoring.middleware import api_user_agent

from .serializers import ActivityLogSerializer


@api_user_agent("Admin has viewed activity logs of other users.")
@api_view(['GET'])
@permission_classes([AllowAny])
def get_activity_logs_next(request, start_index=None, end_index=None):
    """
    Returns the activity logs within the range [start_index: end_index].
    """
    if start_index is None or end_index is None:
        return Response({
            "status": False,
            "message": "Both start_index and end_index parameters are required"
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        logs = ActivityLog.objects.using('traffic_db').order_by(
            "-generated_at"
        )[start_index:end_index+1]

        serializer = ActivityLogSerializer(logs, many=True)
        return Response({
            "status": True,
            "message": "Activity logs retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "status": False,
            "message": f"An error occurred: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
