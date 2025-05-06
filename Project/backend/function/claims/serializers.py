"""
Serializers for claims management
"""
from rest_framework import serializers
from function.models import (
    Accident, Weather, Vehicle, Driver, UserVehicle, 
    UserAccident, Claim, UserClaim
)

class AccidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accident
        fields = '__all__'

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weather
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class UserVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVehicle
        fields = '__all__'

class UserAccidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccident
        fields = '__all__'

class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = '__all__'

class UserClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClaim
        fields = '__all__'

class ClaimSubmissionSerializer(serializers.Serializer):
    """
    Serializer for validating claim submission data
    """
    # Accident information
    AccidentType = serializers.CharField(required=True)
    Weather_Conditions = serializers.CharField(required=True)
    Accident_Date = serializers.CharField(required=True)
    Accident_Description = serializers.CharField(required=True)
    
    # Vehicle and driver information
    Vehicle_Type = serializers.CharField(required=True)
    Vehicle_Age = serializers.IntegerField(required=True)
    Driver_Age = serializers.IntegerField(required=True)
    Number_of_Passengers = serializers.IntegerField(required=True)
    Gender = serializers.CharField(required=True)
    
    # Claim information
    Claim_Date = serializers.CharField(required=True)
    Injury_Prognosis = serializers.CharField(required=True)
    Injury_Description = serializers.CharField(required=True)
    Police_Report_Filed = serializers.BooleanField(default=False)
    Witness_Present = serializers.BooleanField(default=False)
    
    # Special damages fields
    SpecialHealthExpenses = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialReduction = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialOverage = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialAdditionalInjury = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialEarningsLoss = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialUsageLoss = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialMedications = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialAssetDamage = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialRehabilitation = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialFixes = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialLoanerVehicle = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialTripCosts = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialJourneyExpenses = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialTherapy = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # General damages fields
    GeneralRest = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    GeneralFixed = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    GeneralUplift = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Injury indicators
    Exceptional_Circumstances = serializers.BooleanField(default=False)
    Minor_Psychological_Injury = serializers.BooleanField(default=False)
    Dominant_injury = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    Whiplash = serializers.BooleanField(default=False)

    def validate_Accident_Date(self, value):
        """
        Validate date format for Accident_Date
        """
        try:
            import datetime
            datetime.datetime.strptime(value, '%d/%m/%Y %H:%M:%S')
            return value
        except ValueError:
            raise serializers.ValidationError("Accident date must be in format DD/MM/YYYY HH:MM:SS")

    def validate_Claim_Date(self, value):
        """
        Validate date format for Claim_Date
        """
        try:
            import datetime
            datetime.datetime.strptime(value, '%d/%m/%Y %H:%M:%S')
            return value
        except ValueError:
            raise serializers.ValidationError("Claim date must be in format DD/MM/YYYY HH:MM:SS")

class ClaimStatusUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating claim status
    """
    status = serializers.ChoiceField(
        choices=['pending', 'approved', 'rejected', 'settled'],
        required=True
    )