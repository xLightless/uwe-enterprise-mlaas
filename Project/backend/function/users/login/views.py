from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .serializers import UserLoginSerializer
from function.serializer import UserDetailSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        user.last_login = timezone.now()
        user.save()
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        
        # Get user details
        user_serializer = UserDetailSerializer(user)
        
        # Include role_id in the response
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_serializer.data,
            'role_id': serializer.validated_data['role_id']
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserDetailSerializer(user)
    return Response(serializer.data)