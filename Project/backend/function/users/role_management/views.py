"""
This module provides functionality for managing roles in a system.
It includes creating, deleting, viewing, and updating roles
associated with roles.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ...models import Role
from rest_framework.serializers import ModelSerializer


# Serializer for Role
class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


@api_view(['POST'])
@permission_classes([AllowAny])
def add_role(request):
    serializer = RoleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Role added successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(
        {"error": "Failed to add role.", "details": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['PUT'])
@permission_classes([AllowAny])
def update_role(request, role_id):
    role = get_object_or_404(Role, pk=role_id)
    serializer = RoleSerializer(role, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Role updated successfully.", "data": serializer.data},
            status=status.HTTP_200_OK
        )
    return Response(
        {"error": "Failed to update role.", "details": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_role(request, role_id):
    role = get_object_or_404(Role, pk=role_id)
    role.delete()
    return Response(
        {"message": f"Role with ID {role_id} deleted successfully."},
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def view_roles(request):
    roles = Role.objects.all()
    serializer = RoleSerializer(roles, many=True)
    return Response(
        {"message": "Roles retrieved successfully.", "data": serializer.data},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def view_role_detail(request, role_id):
    role = get_object_or_404(Role, pk=role_id)
    serializer = RoleSerializer(role)
    return Response(
        {
            "message": "Role details retrieved successfully.",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )
