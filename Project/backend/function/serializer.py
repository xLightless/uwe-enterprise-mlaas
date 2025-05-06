# flake8: noqa
from rest_framework import serializers
from .models import Users, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

    def validate_role_name(self, value):
        """Ensure the role name is not empty and has a valid length."""
        if not value.strip():
            raise serializers.ValidationError("Role name cannot be empty.")
        if len(value) > 50:
            raise serializers.ValidationError("Role name cannot exceed 50 characters.")
        return value

    def validate(self, attrs):
        """Custom validation for the entire serializer."""
        if 'role_id' in attrs and attrs['role_id'] <= 0:
            raise serializers.ValidationError({"role_id": "Role ID must be a positive integer."})
        return attrs


class UserDetailSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = Users
        fields = [
            'user_id', 'email', 'full_name', 'role', 'created_at',
            'last_login', 'is_verified', 'phone_number', 'is_active',
        ]
        read_only_fields = ['user_id', 'created_at', 'last_login']
