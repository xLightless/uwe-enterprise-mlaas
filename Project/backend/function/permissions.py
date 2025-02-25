from rest_framework import permissions

class IsEditor(permissions.BasePermission):
    """
    Custom permission to only allow editors to edit posts.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_editor