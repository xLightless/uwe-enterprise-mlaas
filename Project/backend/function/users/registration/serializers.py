from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ...models import Users, Role
from twilio.rest import Client
from django.conf import settings

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Users
        fields = ['email', 'password', 'password2', 'full_name', 'phone_number']  
        extra_kwargs = {
            'full_name': {'required': True},
            'phone_number': {'required': True}, 
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        default_role, created = Role.objects.get_or_create(
            role_id=1,
            defaults={'role_id': 1, 'role_name': 'User'}
        )
        user = Users(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            role=default_role,
            phone_number=validated_data['phone_number'], 
        )
        user.set_password(validated_data['password'])
        user.save()

        # Send OTP using Twilio (SMS)
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.verify.services(settings.TWILIO_VERIFY_SERVICE_SID).verifications.create(
            to="+44" + validated_data['phone_number'], 
            channel='sms'
        )

        return user