# flake8: noqa
from rest_framework import serializers
from function.models import Users, Role
from function.serializer import RoleSerializer
from django.contrib.auth.hashers import make_password

class UserProfileSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Users
        fields = [
            'user_id', 'email', 'full_name', 'role', 'phone_number',
            'is_verified', 'created_at', 'last_login', 'is_active',
            'current_password', 'new_password'
        ]
        read_only_fields = [
            'user_id', 'role', 'is_verified',
            'created_at', 'last_login'
        ]

    def validate(self, data):
        # Current password must be provided to change password
        if 'new_password' in data and 'current_password' not in data:
            raise serializers.ValidationError(
                "Current password is required to set a new password"
            )

        # Check if password is correct
        if 'current_password' in data:
            user = self.instance
            if not user.check_password(data['current_password']):
                raise serializers.ValidationError(
                    "Current password is incorrect"
                )

        return data

    def update(self, instance, validated_data):
        # Handle password change
        if 'new_password' in validated_data:
            instance.password = make_password(validated_data['new_password'])
            validated_data.pop('new_password')
            validated_data.pop('current_password')

        return super().update(instance, validated_data)

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source='role',
        required=False
    )

    class Meta:
        model = Users
        fields = [
            'user_id', 'email', 'full_name', 'role_id', 'phone_number',
            'is_verified', 'is_active',
        ]
        read_only_fields = ['user_id']