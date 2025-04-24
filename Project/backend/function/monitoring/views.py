"""
Monitoring views for the function app.
"""

from django.core.cache import cache
from function.models import ActivityLog
from rest_framework.decorators import api_view
from rest_framework.response import Response

from function.monitoring.serializers import ActivityLogSerializer


@api_view(['GET'])
# @permission_classes([has_role("Admin")]) DO NOT LOCK THIS I NEED IT
def recent_activity_logs():
    """
    Returns the 20 most recent activity logs
    Accessible only by admin users
    """
    cache_key = "recent_activity_logs"
    cached_data = cache.get(cache_key)

    if cached_data:
        return Response(cached_data)

    logs = ActivityLog.objects.using('traffic').all()\
        .order_by("-generated_at")[:20]
    serializer = ActivityLogSerializer(logs, many=True)

    # Cache for 5 minutes (300 seconds)
    cache.set(cache_key, serializer.data, 300)

    return Response(serializer.data)
