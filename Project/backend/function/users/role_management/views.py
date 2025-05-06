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

from function.monitoring.middleware import api_user_agent
from function.models import Role, RolePermission
from rest_framework.serializers import ModelSerializer


# Serializer for Role
class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


@api_user_agent("Creating a new role in the system.")
@api_view(['POST'])
@permission_classes([AllowAny])
def add_role(request):
    """
    Add a new role to the system.
    """
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


@api_user_agent("Updating roles by ID.")
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_role(request, role_id):
    """
    Update an existing role by its ID.
    """
    role = get_object_or_404(Role, pk=role_id)
    serializer = RoleSerializer(role, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Role updated successfully.", "data": serializer.data},
            status=status.HTTP_200_OK
        )
    return Response(
        {
            "status": False,
            "message": "Failed to update role.",
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_user_agent("Deleting roles by ID.")
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_role(request, role_id):
    """
    Delete a role by its ID.
    This will also delete all associated permissions.

    :param request: The HTTP request object.
    :param role_id: The ID of the role to delete.
    """
    role = get_object_or_404(Role, pk=role_id)
    role_permission = RolePermission.objects.filter(role=role.role_id)

    has_role_permission = False
    if role_permission.exists():
        has_role_permission = True
        role_permission.delete()

    role.delete()

    message = ""
    if has_role_permission:
        message = "Role and associated permissions deleted successfully."
    else:
        message = "Role deleted successfully."

    return Response(
        {
            "status": True,
            "message": message
        },
        status=status.HTTP_204_NO_CONTENT
    )


@api_user_agent("User has requested to view all roles.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_roles(request):
    """
    Retrieve all roles in the system.
    """
    roles = Role.objects.all()
    serializer = RoleSerializer(roles, many=True)
    return Response(
        {
            "status": True,
            "message": "Roles retrieved successfully.",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_user_agent("Get all role details by ID.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_role_detail(request, role_id):
    """
    View an expanded detail of a specific role by its ID.
    """
    role = get_object_or_404(Role, pk=role_id)
    serializer = RoleSerializer(role)
    return Response(
        {
            "status": True,
            "message": "Role details retrieved successfully.",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )