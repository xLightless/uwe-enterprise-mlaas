"""
Permission Management Serializers
"""

from rest_framework import serializers
from function.models import Permission, RolePermission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['permission_id', 'permission_name']

    def validate_permission_name(self, value):
        # Ensure permission name is stored in lowercase
        return value.lower()


class RolePermissionSerializer(serializers.ModelSerializer):
    permission = PermissionSerializer()

    class Meta:
        model = RolePermission
        fields = ['role_permission_id', 'role', 'permission']

    def create(self, validated_data):
        permission_data = validated_data.pop('permission')
        permission, _ = Permission.objects.get_or_create(
            permission_name=permission_data['permission_name'].lower()
        )
        role_permission = RolePermission.objects.create(
            role=validated_data['role'],
            permission=permission
        )
        return role_permission
