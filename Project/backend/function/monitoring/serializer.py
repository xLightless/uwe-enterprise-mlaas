from rest_framework import serializers
from function.models import ActivityLog
import json


class ActivityLogSerializer(serializers.ModelSerializer):
    device_info = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = [
            'log_id',
            'user',
            'ip_address',
            'description',
            'status_code',
            'generated_at',
            'event_type',
            'device_info'
        ]
        read_only_fields = fields

    def get_device_info(self, obj):
        if obj.device_info:
            try:
                return json.loads(obj.device_info)
            except Exception as e:
                e = e  # Flake please stop being evil :(
                return obj.device_info
        return None