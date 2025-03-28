from rest_framework import serializers
from .models import Model, Prediction, UserModelFeedback

class ModelSerializer(serializers.ModelSerializer):
    total_claims = serializers.SerializerMethodField()

    class Meta:
        model = Model
        fields = '__all__'
        read_only_fields = ['uploaded_at']

    def get_total_claims(self, obj):
        return obj.num_accepted_claims + obj.num_rejected_claims

    def validate_model_version(self, value):
        if value <= 0:
            raise serializers.ValidationError("Model version must be a positive number.")
        return value

    def validate_num_accepted_claims(self, value):
        if value < 0:
            raise serializers.ValidationError("Number of accepted claims cannot be negative.")
        return value

    def validate_num_rejected_claims(self, value):
        if value < 0:
            raise serializers.ValidationError("Number of rejected claims cannot be negative.")
        return value

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = '__all__'

class UserModelFeedbackSerializer(serializers.ModelSerializer):
    def validate_feedback_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Feedback rating must be between 1 and 5.")
        return value

    def validate_settlement_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Settlement amount cannot be negative.")
        return value

    def validate_expected_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Expected amount cannot be negative.")
        return value

    class Meta:
        model = UserModelFeedback
        fields = '__all__'
