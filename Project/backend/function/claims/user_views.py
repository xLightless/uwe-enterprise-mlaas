# flake8: noqa
import os
import json
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from timedelta import datetime
from django.shortcuts import get_object_or_404
import requests
from function.models import (
    Users, Accident, Weather, Vehicle, Driver, UserVehicle,
    UserAccident, Claim, UserClaim, Model)
from function.monitoring.middleware import api_user_agent

@api_user_agent("User submitted a new claim.")
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_claim(request):

    try:
        # Helper function to convert string boolean values to Python boolean
        def convert_to_bool(value):
            if isinstance(value, bool):
                return value
            if isinstance(value, str):
                return value.lower() in ['yes', 'true', '1', 't', 'y']
            return bool(value)

        # Parse dates from the format provided
        accident_date_naive = datetime.datetime.strptime(
            request.data.get('Accident Date'),
            '%d/%m/%Y %H:%M:%S'
        )
        claim_date_naive = datetime.datetime.strptime(
            request.data.get('Claim Date'),
            '%d/%m/%Y %H:%M:%S'
        )

        # Make the datetime objects timezone-aware
        accident_date = timezone.make_aware(accident_date_naive)
        claim_date = timezone.make_aware(claim_date_naive)

        # Get or create accident type
        accident_type, _ = Accident.objects.get_or_create(
            accident_type=request.data.get('AccidentType')
        )

        # Get or create weather conditions
        weather, _ = Weather.objects.get_or_create(
            weather_conditions=request.data.get('Weather Conditions')
        )

        # Get or create vehicle type
        vehicle, _ = Vehicle.objects.get_or_create(
            vehicle_type=request.data.get('Vehicle Type')
        )

        # Create driver information
        driver = Driver.objects.create(
            driver_age=request.data.get('Driver Age'),
            gender=request.data.get('Gender'),
            number_of_passengers=request.data.get('Number of Passengers', 0)
        )

        # Create user vehicle
        user_vehicle = UserVehicle.objects.create(
            user=request.user,
            vehicle=vehicle,
            vehicle_age=request.data.get('Vehicle Age'),
            driver=driver
        )

        # Create user accident
        user_accident = UserAccident.objects.create(
            accident=accident_type,
            weather=weather,
            user_vehicle=user_vehicle,
            accident_description=request.data.get('Accident Description'),
            accident_date=accident_date
        )

        # Create claim
        claim = Claim.objects.create(
            injury_prognosis=request.data.get('Injury_Prognosis'),
            injury_description=request.data.get('Injury Description'),
            police_report_filed=convert_to_bool(request.data.get('Police Report Filed', False)),
            claim_date=claim_date,
            witness_present=convert_to_bool(request.data.get('Witness Present', False)),

            # Special damages fields
            SpecialHealthExpenses=request.data.get('SpecialHealthExpenses', 0),
            SpecialReduction=request.data.get('SpecialReduction', 0),
            SpecialOverage=request.data.get('SpecialOverage', 0),
            SpecialAdditionalInjury=request.data.get('SpecialAdditionalInjury', 0),
            SpecialEarningsLoss=request.data.get('SpecialEarningsLoss', 0),
            SpecialUsageLoss=request.data.get('SpecialUsageLoss', 0),
            SpecialMedication=request.data.get('SpecialMedications', 0),
            SpecialAssetDamage=request.data.get('SpecialAssetDamage', 0),
            SpecialRehabilitation=request.data.get('SpecialRehabilitation', 0),
            SpecialFixes=request.data.get('SpecialFixes', 0),
            SpecialLoanerVehicle=request.data.get('SpecialLoanerVehicle', 0),
            SpecialTripCosts=request.data.get('SpecialTripCosts', 0),
            SpecialJourneyExpenses=request.data.get('SpecialJourneyExpenses', 0),
            SpecialTherapy=request.data.get('SpecialTherapy', 0),

            # General damages fields
            GeneralRest=request.data.get('GeneralRest', 0),
            GeneralFixed=request.data.get('GeneralFixed', 0),
            GeneralUplift=request.data.get('GeneralUplift', 0),

            # Injury indicators
            Exceptional_Circumstances=convert_to_bool(request.data.get('Exceptional_Circumstances', False)),
            Minor_Psychological_Injury=convert_to_bool(request.data.get('Minor_Psychological_Injury', False)),
            Dominant_injury=request.data.get('Dominant injury'),
            Whiplash=convert_to_bool(request.data.get('Whiplash', False))
        )

        # Prepare data for prediction
        prediction_data = request.data.copy()

        # Default values if prediction fails
        predicted_value = 0
        prediction_explanation = {}
        prediction_reason = "Unable to generate prediction"
        active_model = None

        # Find the currently active model
        try:
            active_model = Model.objects.filter(is_active=True).first()
            if not active_model:
                print("No active model found. Using default values.")
        except Exception as e:
            print(f"Error retrieving active model: {str(e)}")

        # Connect directly to the ML service
        try:
            # Use the ML service directly (this worked in the logs)
            prediction_url = "http://ml-service:5000/predict"

            # Increase timeout for model processing
            prediction_response = requests.post(
                prediction_url,
                json=prediction_data,
                timeout=60  # Increased timeout
            )

            if prediction_response.status_code == 200:
                prediction_result = prediction_response.json()

                # Extract all relevant information from the prediction result
                if 'predicted_amount' in prediction_result:
                    # Remove the pound sign and convert to float
                    amount_str = prediction_result['predicted_amount'].replace('£', '')
                    predicted_value = float(amount_str)

                if 'explanation' in prediction_result:
                    prediction_explanation = prediction_result['explanation']

                if 'generated_reason' in prediction_result:
                    prediction_reason = prediction_result['generated_reason']
            else:
                print(f"ML service returned status code: {prediction_response.status_code}")
                print(f"Response content: {prediction_response.text}")

        except requests.RequestException as e:
            # Log prediction error but continue with default values
            print(f"ML service error: {str(e)}")

        # Create user claim with the predicted value and the active model ID
        user_claim = UserClaim.objects.create(
            user_accident=user_accident,
            claim=claim,
            predicted_settlement_value=predicted_value,
            pending_claim='pending',
            user=request.user,
            model=active_model  # Associate the active model with the claim
        )

        if (prediction_reason == "Unable to generate prediction"):
            return Response({
                "status": False,
                "message": "Prediction failed. Please try again later.",
            })

        # Return the full prediction information in the response
        # even though we're not storing all of it
        return Response({
            "message": "Claim submitted successfully",
            "claim_id": user_claim.user_claim_id,
            "predicted_settlement": f"£{predicted_value:.2f}",
            "prediction_explanation": prediction_explanation,
            "prediction_reason": prediction_reason,
            "model_id": active_model.model_id if active_model else None  # Include model ID in response
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Enhanced error handling with more details
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Claim submission error: {str(e)}")
        print(f"Traceback: {error_traceback}")

        return Response({
            "error": f"Failed to submit claim: {str(e)}",
            "details": error_traceback
        }, status=status.HTTP_400_BAD_REQUEST)


@api_user_agent("User viewed their claims.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_claims(request):
    """
    Retrieve all claims submitted by the current user.
    """
    try:
        user_claims = UserClaim.objects.filter(user=request.user)

        claims_data = []
        for user_claim in user_claims:
            claim = user_claim.claim
            user_accident = user_claim.user_accident
            vehicle = user_accident.user_vehicle.vehicle

            claims_data.append({
                "claim_id": user_claim.user_claim_id,
                "accident_type": user_accident.accident.accident_type,
                "accident_date": user_accident.accident_date,
                "claim_date": claim.claim_date,
                "vehicle_type": vehicle.vehicle_type,
                "status": user_claim.pending_claim,
                "predicted_settlement": user_claim.predicted_settlement_value
            })

        return Response({
            "claims": claims_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to retrieve claims: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin viewed claim details.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_claim_details(request, claim_id):
    """
    Admin endpoint to retrieve detailed information about a specific claim.
    """
    try:
        # Get the user claim without user restriction
        user_claim = get_object_or_404(UserClaim, user_claim_id=claim_id)

        # Get related objects
        claim = user_claim.claim
        user_accident = user_claim.user_accident
        user_vehicle = user_accident.user_vehicle
        driver = user_vehicle.driver
        user = user_claim.user

        # Calculate total special damages
        total_special_damages = (
            claim.SpecialHealthExpenses +
            claim.SpecialReduction +
            claim.SpecialOverage +
            claim.SpecialAdditionalInjury +
            claim.SpecialEarningsLoss +
            claim.SpecialUsageLoss +
            claim.SpecialMedication +
            claim.SpecialAssetDamage +
            claim.SpecialRehabilitation +
            claim.SpecialFixes +
            claim.SpecialLoanerVehicle +
            claim.SpecialTripCosts +
            claim.SpecialJourneyExpenses +
            claim.SpecialTherapy
        )

        # Calculate total general damages
        total_general_damages = (
            claim.GeneralRest +
            claim.GeneralFixed +
            claim.GeneralUplift
        )

        # Compile detailed claim information
        claim_data = {
            "claim_id": user_claim.user_claim_id,
            "status": user_claim.pending_claim,
            "predicted_settlement": user_claim.predicted_settlement_value,

            # User information
            "user_info": {
                "user_id": user.user_id,
                "full_name": user.full_name,
                "email": user.email,
                "phone_number": user.phone_number
            },

            # Accident information
            "accident_info": {
                "accident_type": user_accident.accident.accident_type,
                "accident_date": user_accident.accident_date,
                "accident_description": user_accident.accident_description,
                "weather_conditions": user_accident.weather.weather_conditions
            },

            # Vehicle information
            "vehicle_info": {
                "vehicle_type": user_vehicle.vehicle.vehicle_type,
                "vehicle_age": user_vehicle.vehicle_age
            },

            # Driver information
            "driver_info": {
                "driver_age": driver.driver_age,
                "gender": driver.gender,
                "number_of_passengers": driver.number_of_passengers
            },

            # Claim information
            "claim_info": {
                "claim_date": claim.claim_date,
                "injury_prognosis": claim.injury_prognosis,
                "injury_description": claim.injury_description,
                "police_report_filed": claim.police_report_filed,
                "witness_present": claim.witness_present
            },

            # Special damages
            "special_damages": {
                "health_expenses": float(claim.SpecialHealthExpenses),
                "reduction": float(claim.SpecialReduction),
                "overage": float(claim.SpecialOverage),
                "additional_injury": float(claim.SpecialAdditionalInjury),
                "earnings_loss": float(claim.SpecialEarningsLoss),
                "usage_loss": float(claim.SpecialUsageLoss),
                "medication": float(claim.SpecialMedication),
                "asset_damage": float(claim.SpecialAssetDamage),
                "rehabilitation": float(claim.SpecialRehabilitation),
                "fixes": float(claim.SpecialFixes),
                "loaner_vehicle": float(claim.SpecialLoanerVehicle),
                "trip_costs": float(claim.SpecialTripCosts),
                "journey_expenses": float(claim.SpecialJourneyExpenses),
                "therapy": float(claim.SpecialTherapy),
                "total_special_damages": float(total_special_damages)
            },

            # General damages
            "general_damages": {
                "rest": float(claim.GeneralRest),
                "fixed": float(claim.GeneralFixed),
                "uplift": float(claim.GeneralUplift),
                "total_general_damages": float(total_general_damages)
            },

            # Injury indicators
            "injury_indicators": {
                "exceptional_circumstances": claim.Exceptional_Circumstances,
                "minor_psychological_injury": claim.Minor_Psychological_Injury,
                "dominant_injury": claim.Dominant_injury,
                "whiplash": claim.Whiplash
            },

            # Total claimed amount
            "total_claimed_amount": float(total_special_damages + total_general_damages)
        }

        return Response(claim_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to retrieve admin claim details: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)
