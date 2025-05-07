# flake8: noqa
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from drf_yasg.utils import swagger_auto_schema
import function.util.swu as swu
from .serializers import UserProfileSerializer, AdminUserUpdateSerializer, UserCreateSerializer
from function.models import Users
from function.monitoring.middleware import api_user_agent
from function.permissions import has_role, has_permission


@api_user_agent("Authenticated user requested their profile.")
@swagger_auto_schema(
    method="get",
    responses={200: UserProfileSerializer}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    """Get detailed information about the current user"""
    user = request.user
    serializer = UserProfileSerializer(user)
    response = serializer.data
    response["permissions"] = user.get_permissions()
    return Response(serializer.data)


@swagger_auto_schema(
    method="put",
    request_body=UserProfileSerializer,
    responses={200: UserProfileSerializer}
)
@api_user_agent("Authenticated user updated their profile.")
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update the current user's profile information"""
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method="get",
    responses={200: UserProfileSerializer(many=True)}
)
@api_user_agent("Admin requested a list of all users.")
@api_view(['GET'])
# @permission_classes([has_role("Admin")])
@permission_classes([AllowAny])
def list_all_users(request):
    """List all users (Admin only)"""
    users = Users.objects.all()
    serializer = UserProfileSerializer(users, many=True)
    return Response({
        "status": True,
        "message": "Users retrieved successfully",
        "data": serializer.data
    })


@swagger_auto_schema(
    method="get",
    responses={200: UserProfileSerializer}
)
@api_user_agent("Admin requested user details by ID.")
@api_view(['GET'])
# @permission_classes([has_role("Admin")])
@permission_classes([AllowAny])
def get_user_by_id(request, user_id):
    """Get user details by ID (Admin only)"""
    try:
        user = Users.objects.get(user_id=user_id)
        serializer = UserProfileSerializer(user)
        return Response({
            "status": True,
            "message": "User retrieved successfully",
            "data": serializer.data
        })
    except Users.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "Cannot retrieve this information. User not found.",
            },
            status=status.HTTP_404_NOT_FOUND
        )


@swagger_auto_schema(
    method="put",
    request_body=AdminUserUpdateSerializer,
    responses={200: AdminUserUpdateSerializer}
)
@api_user_agent("Admin attempted to update user details.")
@api_view(['PUT'])
@permission_classes([has_permission("manage_user_accounts")])
@permission_classes([AllowAny])
def admin_update_user(request, user_id):
    """Update any user's details (Admin only)"""
    try:
        user = Users.objects.get(user_id=user_id)
        serializer = AdminUserUpdateSerializer(
            user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Users.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "Cannot update this user.",
            },
            status=status.HTTP_404_NOT_FOUND
        )

@swagger_auto_schema(
    method="delete",
    responses={204: "User successfully deleted"}
)
@api_user_agent("Admin attempted to delete a user.")
@api_view(['DELETE'])
@permission_classes([has_role("Admin")])
def delete_user(request, user_id):
    """Delete a user (Admin only)"""
    try:
        user = Users.objects.get(user_id=user_id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Users.DoesNotExist:
        return Response(
            {
                "status": False,
                "message": "Cannot delete this user."
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
@swagger_auto_schema(
    method="post",
    request_body=swu.request(
        "password:string",
        "password2:string",
        "email:string",
        "full_name:string",
        "phone_number:string",
        "role_id:integer"
    ),
    responses={201: swu.response(
        "user:object"
    )}
)
#@api_user_agent("Admin created to attempt user")
@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    """
    Creates a user
    """
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        return Response({
            "status": True,
            "user": serializer.data,
            "permissions": user.get_permissions(),
            "message": "User created successfully"
        }, status=status.HTTP_201_CREATED)

    errors = []
    for k, v in serializer.errors.items():
        errors.append(f"{k}: {v[0]}")
    return Response({
            'status': False,
            'message': errors,
        }, status=status.HTTP_400_BAD_REQUEST)