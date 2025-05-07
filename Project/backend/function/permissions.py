from rest_framework.permissions import BasePermission


def has_permission(perm):
    """Factory function that returns a HasPermission for [perm]"""
    class HasPermission(BasePermission):
        def has_permission(self, request, view):
            return (
                request.user and
                request.user.is_authenticated and
                request.user.has_permission(perm)
            )
    return HasPermission


def has_role(role_name):
    """Factory function that returns a HasRole for [role_name]"""
    class HasRole(BasePermission):
        def has_permission(self, request, view):
            return (
                request.user and
                request.user.is_authenticated and
                request.user.role.role_name == role_name
            )

    return HasRole
