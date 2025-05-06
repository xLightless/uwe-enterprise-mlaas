"""
This module provides functionality for managing permissions in a system.
It includes creating, deleting, viewing, and updating permissions associated
with roles.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from function.models import Permission, RolePermission, Role
from function.monitoring.middleware import api_user_agent
from .serializer import PermissionSerializer


@api_user_agent("Admin has created a new permission.")
@api_view(['POST'])
@permission_classes([AllowAny])
def create_permission(request):
    """
    Create a new permission and attach it to a role.
    This endpoint requires a role ID to associate the permission with.
    """
    role_id = request.data.get('role_id')
    if not role_id:
        return Response(
            {"error": "Role ID is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        role = Role.objects.get(pk=role_id)
    except Role.DoesNotExist:
        return Response(
            {"error": "Role not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = PermissionSerializer(data=request.data)
    if serializer.is_valid():
        permission = serializer.save()
        # Attach the permission to the role
        RolePermission.objects.create(role=role, permission=permission)
        return Response(
            {
                "message": ("Permission created and attached" +
                            " to role successfully."),
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        {"error": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_user_agent("Admin has deleted a permission.")
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_permission(request, permission_id):
    """
    Delete a permission by its ID.
    This endpoint will also remove the permission from any associated roles.
    """
    try:
        permission = Permission.objects.get(pk=permission_id)
        permission.delete()
        return Response(
            {"message": "Permission deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )
    except Permission.DoesNotExist:
        return Response(
            {"error": "Permission not found."},
            status=status.HTTP_404_NOT_FOUND
        )


@api_user_agent("Admin has requested to view all role permissions.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_all_role_permissions(request):
    """Return a list of all role permissions in the database."""
    role_permissions = RolePermission.objects.all()
    grouped_permissions = {}

    # Group permissions by role
    for role_permission in role_permissions:
        role_id = role_permission.role.role_id
        role_name = role_permission.role.role_name
        if role_id not in grouped_permissions:
            grouped_permissions[role_id] = {
                "role_id": role_id,
                "role_name": role_name,
                "permissions": []
            }
        grouped_permissions[role_id]["permissions"].append({
            "permission_name": role_permission.permission.permission_name
        })

    # Convert grouped permissions to a list
    response_data = list(grouped_permissions.values())
    return Response({"data": response_data}, status=status.HTTP_200_OK)


@api_user_agent("Admin has requested to view available permissions.")
@api_view(['GET'])
@permission_classes([AllowAny])
def get_database_permissions(request):
    """Return an object of all permissions in the database."""
    permissions = Permission.objects.all()
    permission_names = [
        permission.permission_name for permission in permissions
    ]
    return Response({"data": {
        "permissions": permission_names
    }}, status=status.HTTP_200_OK)


@api_user_agent("Admin has requested to view permissions by role ID.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_permissions_by_role(request, role_id):
    """Return a list of permissions associated with a specific role."""
    try:
        role = Role.objects.get(pk=role_id)
        role_permissions = RolePermission.objects.filter(role=role)

        # Format the response to include role name
        grouped_permissions = {
            "role": role_id,
            "role_name": role.role_name,  # Include the role name
            "permissions": [
                {"permission_name": rp.permission.permission_name}
                for rp in role_permissions
            ]
        }

        return Response(
            {"data": grouped_permissions},
            status=status.HTTP_200_OK
        )
    except Role.DoesNotExist:
        return Response(
            {"error": "Role not found."},
            status=status.HTTP_404_NOT_FOUND
        )


@api_user_agent("Admin has requested to update a permission.")
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_permission(request, permission_id):
    """
    Update an existing permission by its ID.
    """
    try:
        # Fetch the permission to be updated
        permission = Permission.objects.get(pk=permission_id)
    except Permission.DoesNotExist:
        return Response(
            {"error": "Permission not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Get the new role ID if provided
    role_id = request.data.get('role_id')
    if role_id:
        try:
            role = Role.objects.get(pk=role_id)
        except Role.DoesNotExist:
            return Response(
                {"error": "Role not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    # Update the permission name if provided
    permission_name = request.data.get('permission_name')
    if permission_name:
        permission.permission_name = permission_name.lower()
        permission.save()

    # Update the role assignment if a new role is provided
    if role_id:
        # Remove the existing RolePermission relationship
        RolePermission.objects.filter(permission=permission).delete()
        # Create a new RolePermission relationship
        RolePermission.objects.create(role=role, permission=permission)

    return Response(
        {"message": "Permission updated successfully."},
        status=status.HTTP_200_OK
    )


@api_user_agent("Admin has requested to add a permission to a role.")
@api_view(['PUT'])
@permission_classes([AllowAny])
def add_permission(request, role_id):
    """
    Add a new permission to a role, if it doesn't already exist.
    """
    try:
        role = Role.objects.get(pk=role_id)
    except Role.DoesNotExist:
        return Response(
            {
                "status": False,
                "error": "No role found with this ID."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    permission_name: str = request.data.get('permission_name')
    if not permission_name:
        return Response(
            {
                "status": False,
                "error": "Permission name is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    role_permissions = RolePermission.objects.filter(
        role=role, permission__permission_name=permission_name.lower()
    )
    if role_permissions.exists():
        return Response(
            {
                "status": False,
                "error": "This permission already exists for this role."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create the new permission
    permission = Permission.objects.create(
        permission_name=permission_name.lower()
    )

    # Attach the permission to the role
    RolePermission.objects.create(
        role=role, permission=permission
    )

    return Response(
        {
            "status": True,
            "message": "Permission added successfully."
        },
        status=status.HTTP_201_CREATED
    )


@api_user_agent("Admin has requested to remove a permission from a role.")
@api_view(['DELETE'])
@permission_classes([AllowAny])
def remove_role_permission(request, role_id):
    """
    Remove a permission from a role.
    """
    try:
        role = Role.objects.get(pk=role_id)
    except Role.DoesNotExist:
        return Response(
            {
                "status": False,
                "error": "No role found with this ID."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    permission_name: str = request.data.get('permission_name')
    if not permission_name:
        return Response(
            {
                "status": False,
                "error": "Permission name is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        role_permission = RolePermission.objects.get(
            role=role, permission__permission_name=permission_name.lower()
        )
        role_permission.delete()
        return Response(
            {
                "status": True,
                "message": "Permission removed successfully."
            },
            status=status.HTTP_200_OK
        )
    except RolePermission.DoesNotExist:
        return Response(
            {
                "status": False,
                "error": "This permission does not exist for this role."
            },
            status=status.HTTP_404_NOT_FOUND
        )