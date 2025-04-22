from rest_framework.permissions import BasePermission


class HasPermission(BasePermission):
    """Not complete"""
    def __init__(self, perm):
        self.perm = perm

    def has_permission(self, request, view):
        return request.user.role.role_name == "User"


def has_role(role_name):
    class HasRole(BasePermission):

        def has_permission(self, request, view):
            return request.user.role.role_name == role_name

    return HasRole