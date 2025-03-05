from rest_framework import serializers
from .models import Users, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_id', 'role_name']
        read_only_fields = ['role_id']

class UserDetailSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    
    class Meta:
        model = Users
        fields = [
            'user_id', 'email', 'full_name', 'role', 'created_at', 
            'last_login', 'is_verified', 'phone_number', 'is_active', 
            'is_staff', 'is_admin', 'is_superuser'
        ]
        read_only_fields = ['user_id', 'created_at', 'last_login']