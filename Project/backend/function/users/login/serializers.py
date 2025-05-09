# flake8: noqa
from rest_framework import serializers
from django.contrib.auth import authenticate
import re

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True) # Email field changed to handle regex emails.
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        def validate_email(email):
            print("Running email regex validation on:", email)  # Debug line
            regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$'
            if not re.match(regex, email):
                raise serializers.ValidationError("Invalid email format.")
            return email

        print("validating creds: ", email, password)

        if email and password:
            validate_email(email)
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )

            if not user:
                raise serializers.ValidationError('Invalid credentials')

            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
        else:
            raise serializers.ValidationError(
                'Must include "email" and "password"')

        attrs['user'] = user
        attrs['role_id'] = user.role.role_id
        return attrs
