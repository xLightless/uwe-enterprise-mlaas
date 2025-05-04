"""
Monitoring views for the function app.
"""

from datetime import timezone
from function.models import ActivityLog
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models.functions import TruncDate
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone

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


@api_user_agent("Admin attempted to retrieve an activity log chart info.")
@api_view(['GET'])
@permission_classes([AllowAny])
def count_connections(request):
    """
    Returns the daily count of connections made to
    the API in the last 3 months.
    """
    try:
        today = timezone.now()
        start_date = today - timedelta(days=90)

        logs = (
            ActivityLog.objects.using('traffic_db')
            .filter(generated_at__gte=start_date)
            .annotate(date=TruncDate('generated_at'))
            .values('date')
            .annotate(count=Count('log_id'))
            .order_by('date')
        )

        data = [
            {
                "generated_at": entry["date"],
                "total_connections": entry["count"]
            }
            for entry in logs
        ]

        return Response({
            "status": True,
            "message": "Activity log chart data retrieved successfully",
            "data": data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "status": False,
            "message": f"An error occurred: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
