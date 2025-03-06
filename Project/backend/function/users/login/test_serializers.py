# flake8: noqa
import pytest
from rest_framework.exceptions import ValidationError
from function.users.login.serializers import UserLoginSerializer


@pytest.mark.django_db
class TestUserLoginSerializer:

    def test_valid_credentials(self, mocker):
        mocker.patch('django.contrib.auth.authenticate',
                    return_value=mocker.Mock())
        data = {'email': 'test@example.com', 'password': 'password123'}
        serializer = UserLoginSerializer(data=data)
        assert serializer.is_valid()
        assert 'user' in serializer.validated_data

    def test_invalid_credentials(self, mocker):
        mocker.patch('django.contrib.auth.authenticate', return_value=None)
        data = {'email': 'test@example.com', 'password': 'wrongpassword'}
        serializer = UserLoginSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert 'Invalid credentials' in str(excinfo.value)

    def test_empty_fields(self):
        data = {'email': '', 'password': ''}
        serializer = UserLoginSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert 'Must include "email" and "password"' in str(excinfo.value)

    def test_fields_exceeding_length(self):
        data = {'email': 'a' * 255 + '@example.com','password': 'a' * 129}
        serializer = UserLoginSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert 'Ensure this field has no more than 254 characters.' in str(
                                                                excinfo.value)

    def test_incorrect_details(self):
        data = {'email': 'notanemail', 'password': 'short'}
        serializer = UserLoginSerializer(data=data)
        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
        assert 'Enter a valid email address.' in str(excinfo.value)
        assert 'Ensure this field has at least 8 characters.' in str(excinfo.
                                                                    value)
