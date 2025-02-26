from django.utils.timesince import timesince
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model
from .models import Post

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        # Ensure 'is_editor' is included
        fields = ['id', 'username', 'password', 'is_editor']
        extra_kwargs = {'password': {'write_only': True}}

    def perform_create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    content_length = serializers.SerializerMethodField()
    time_since_creation = serializers.SerializerMethodField()
    content_summary = serializers.SerializerMethodField()

    def get_content_length(self, obj):
        return len(obj.content)

    def get_time_since_creation(self, obj):
        return timesince(obj.created_at) + ' ago'

    def get_content_summary(self, obj):
        return obj.content[:100] + \
            '...' if len(obj.content) > 100 else obj.content

    class Meta:
        model = Post
        fields = ['id', 'title', 'author', 'content', 'author_username',
                  'content_length', 'time_since_creation', 'content_summary']
