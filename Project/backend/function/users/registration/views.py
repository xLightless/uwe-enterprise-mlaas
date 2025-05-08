
# flake8: noqa
from django.core.cache import cache
from django.conf import settings
from twilio.rest import Client
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserCreateSerializer
from function.models import Users, Role

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        phone_number = serializer.validated_data.get('phone_number')
        
        # Ensure password is included
        if 'password' not in serializer.validated_data:
            return Response({"error": "Password is required"}, 
                          status=status.HTTP_400_BAD_REQUEST)
            
        cache_key = f"user_data_{phone_number}"
        
        # Cache the validated user data for 5 minutes
        cache.set(cache_key, serializer.validated_data, timeout=300)
        
        # Send SMS OTP using Twilio
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.verify.services(settings.TWILIO_VERIFY_SERVICE_SID).verifications.create(
            to=f"+44{phone_number}",
            channel='sms'
        )
        
        return Response({
            "message": "User data cached. Check your phone for verification."
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone_number = request.data.get('phone_number')
    otp = request.data.get('otp')
    
    # Validate input
    if not phone_number or not otp:
        return Response(
            {"error": "Phone number and OTP are required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Verify OTP using Twilio
        client = Client(
            settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        verification_check = client.verify.services(
            settings.TWILIO_VERIFY_SERVICE_SID).verification_checks.create(
            to=f"+44{phone_number}",
            code=otp
        )
        
        if verification_check.status == "approved":
            # Retrieve cached user data
            cache_key = f"user_data_{phone_number}"
            user_data = cache.get(cache_key)
            
            if user_data:
                # Get the password before it's removed
                password = user_data.get('password')
                
                if not password:
                    return Response({"error": "Password is required."},
                                  status=status.HTTP_400_BAD_REQUEST)
                
                # Create the user manually rather than using serializer.save()
                default_role, created = Role.objects.get_or_create(
                    role_id=1,
                    defaults={'role_id': 1, 'role_name': 'User'}
                )
                
                # Create user object but don't save it yet
                user = Users(
                    email=user_data['email'],
                    full_name=user_data['full_name'],
                    role=default_role,
                    phone_number=user_data['phone_number'],
                    is_verified=True
                )
                
                # Set the password properly
                user.set_password(password)
                # Don't manually set password to None here - the set_password method should handle it properly
                user.save()
                
                # Clear the cache
                cache.delete(cache_key)
                
                # Use serializer only for response data
                serializer = UserCreateSerializer(user)
                
                return Response({
                    "message": "User verified and registered successfully.",
                    "user": serializer.data
                }, status=status.HTTP_201_CREATED)
                
            return Response({"error": "User data not found in cache."},
                          status=status.HTTP_400_BAD_REQUEST)
            
        return Response({"error": "Invalid OTP."},
                      status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({"error": str(e)},
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)