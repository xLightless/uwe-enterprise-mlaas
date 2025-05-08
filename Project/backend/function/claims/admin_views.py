# flake8: noqa
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Sum, Q
from django.utils import timezone
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from function.models import Users, UserClaim, Claim, Model
from function.monitoring.middleware import api_user_agent
from decimal import Decimal


@api_user_agent("Admin viewed claims by status.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_claims_by_status(request, status_filter):
    """
    Retrieve claims filtered by status (pending, approved, rejected, settled).
    """

    # Validate status parameter
    if status_filter not in ['pending', 'approved', 'rejected', 'settled', 'all']:
        return Response({
            "error": "Invalid status filter. Must be one of: pending, approved, rejected, settled, all"
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Apply filter unless 'all' is specified
        if status_filter == 'all':
            user_claims = UserClaim.objects.all()
        else:
            user_claims = UserClaim.objects.filter(pending_claim=status_filter)

        # Apply sorting if provided
        sort_by = request.query_params.get('sort_by', 'claim__claim_date')
        sort_order = request.query_params.get('sort_order', 'desc')

        if sort_order.lower() == 'desc':
            sort_by = f"-{sort_by}"

        user_claims = user_claims.order_by(sort_by)

        # Apply pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        # Get total count before pagination
        total_count = user_claims.count()

        # Apply pagination
        user_claims = user_claims[start_idx:end_idx]

        claims_data = []
        for user_claim in user_claims:
            claims_data.append({
                "claim_id": user_claim.user_claim_id,
                "user_email": user_claim.user.email,
                "user_name": user_claim.user.full_name,
                "accident_type": user_claim.user_accident.accident.accident_type,
                "claim_date": user_claim.claim.claim_date,
                "accident_date": user_claim.user_accident.accident_date,
                "status": user_claim.pending_claim,
                "predicted_settlement": user_claim.predicted_settlement_value,
                "settled_amount": user_claim.settled_amount if hasattr(user_claim, 'settled_amount') and user_claim.settled_amount else None,
                "dominant_injury": user_claim.claim.Dominant_injury,
                "vehicle_type": user_claim.user_accident.user_vehicle.vehicle.vehicle_type
            })

        return Response({
            "claims": claims_data,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size  # Ceiling division
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to retrieve claims: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin updated claim settlement and status.")
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_claim(request, claim_id):
    """
    Update claim status and settlement amount.
    Also updates the model's acceptance/rejection counts when applicable.
    """
    try:
        user_claim = get_object_or_404(UserClaim, user_claim_id=claim_id)
        previous_status = user_claim.pending_claim

        # Check for status update
        new_status = request.data.get('status')
        if new_status:
            if new_status not in ['pending', 'approved', 'rejected', 'settled']:
                return Response({
                    "error": "Invalid status provided. Must be one of: pending, approved, rejected, settled"
                }, status=status.HTTP_400_BAD_REQUEST)

            user_claim.pending_claim = new_status

            # Update model counts if status changed to approved or rejected
            # Only count the transition from pending to approved/rejected to avoid double-counting
            if previous_status == 'pending' and user_claim.model:
                if new_status == 'approved':
                    # Increment the num_accepted_claims counter for this model
                    user_claim.model.num_accepted_claims += 1
                    user_claim.model.save()
                elif new_status == 'rejected':
                    # Increment the num_rejected_claims counter for this model
                    user_claim.model.num_rejected_claims += 1
                    user_claim.model.save()

        # Check for settlement amount override
        new_settlement = request.data.get('settlement_amount')
        if new_settlement is not None:
            try:
                # Ensure settlement_amount is a valid decimal
                settlement_amount = Decimal(str(new_settlement))

                # If the model doesn't have settled_amount field, add it
                if not hasattr(UserClaim, 'settled_amount'):
                    # This is a temporary solution - ideally you'd migrate the database
                    # to add this field properly
                    user_claim.settled_amount = settlement_amount
                else:
                    user_claim.settled_amount = settlement_amount

                # If status is being set to 'settled', update the predicted value too
                if new_status == 'settled':
                    user_claim.predicted_settlement_value = settlement_amount
            except (ValueError, TypeError):
                return Response({
                    "error": "Invalid settlement amount provided"
                }, status=status.HTTP_400_BAD_REQUEST)

        # Add admin notes if provided
        admin_notes = request.data.get('admin_notes')
        if admin_notes:
            if not hasattr(user_claim, 'admin_notes'):
                # Again, this is a temporary solution
                user_claim.admin_notes = admin_notes
            else:
                user_claim.admin_notes = admin_notes

        # Save changes
        user_claim.save()

        # Prepare response
        response_data = {
            "message": "Claim updated successfully",
            "claim_id": user_claim.user_claim_id,
            "status": user_claim.pending_claim,
            "settlement_amount": getattr(user_claim, 'settled_amount', user_claim.predicted_settlement_value)
        }

        # Add model info if available
        if user_claim.model:
            response_data["model_info"] = {
                "model_id": user_claim.model.model_id,
                "model_name": user_claim.model.model_name,
                "model_version": user_claim.model.model_version,
                "num_accepted_claims": user_claim.model.num_accepted_claims,
                "num_rejected_claims": user_claim.model.num_rejected_claims
            }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to update claim: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin viewed claim details.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_claim_details(request, claim_id):
    """
    Retrieve detailed information about a specific claim for admin.
    """

    try:
        user_claim = get_object_or_404(UserClaim, user_claim_id=claim_id)

        # Get related objects
        claim = user_claim.claim
        user_accident = user_claim.user_accident
        user_vehicle = user_accident.user_vehicle
        driver = user_vehicle.driver

        # Calculate total special damages
        special_damages_total = (
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
        general_damages_total = (
            claim.GeneralRest +
            claim.GeneralFixed +
            claim.GeneralUplift
        )

        # Compile detailed claim information
        claim_data = {
            "claim_id": user_claim.user_claim_id,
            "status": user_claim.pending_claim,
            "predicted_settlement": user_claim.predicted_settlement_value,

            # User details
            "user_info": {
                "user_id": user_claim.user.user_id,
                "full_name": user_claim.user.full_name,
                "email": user_claim.user.email,
                "phone_number": user_claim.user.phone_number
            },

            # Accident details
            "accident_info": {
                "accident_type": user_accident.accident.accident_type,
                "accident_date": user_accident.accident_date,
                "accident_description": user_accident.accident_description,
                "weather_conditions": user_accident.weather.weather_conditions
            },

            # Vehicle details
            "vehicle_info": {
                "vehicle_type": user_vehicle.vehicle.vehicle_type,
                "vehicle_age": user_vehicle.vehicle_age
            },

            # Driver details
            "driver_info": {
                "driver_age": driver.driver_age,
                "gender": driver.gender,
                "number_of_passengers": driver.number_of_passengers
            },

            # Claim details
            "claim_info": {
                "claim_date": claim.claim_date,
                "injury_prognosis": claim.injury_prognosis,
                "injury_description": claim.injury_description,
                "police_report_filed": claim.police_report_filed,
                "witness_present": claim.witness_present
            },

            # Special damages
            "special_damages": {
                "health_expenses": claim.SpecialHealthExpenses,
                "reduction": claim.SpecialReduction,
                "overage": claim.SpecialOverage,
                "additional_injury": claim.SpecialAdditionalInjury,
                "earnings_loss": claim.SpecialEarningsLoss,
                "usage_loss": claim.SpecialUsageLoss,
                "medication": claim.SpecialMedication,
                "asset_damage": claim.SpecialAssetDamage,
                "rehabilitation": claim.SpecialRehabilitation,
                "fixes": claim.SpecialFixes,
                "loaner_vehicle": claim.SpecialLoanerVehicle,
                "trip_costs": claim.SpecialTripCosts,
                "journey_expenses": claim.SpecialJourneyExpenses,
                "therapy": claim.SpecialTherapy,
                "total_special_damages": special_damages_total
            },

            # General damages
            "general_damages": {
                "rest": claim.GeneralRest,
                "fixed": claim.GeneralFixed,
                "uplift": claim.GeneralUplift,
                "total_general_damages": general_damages_total
            },

            # Injury indicators
            "injury_indicators": {
                "exceptional_circumstances": claim.Exceptional_Circumstances,
                "minor_psychological_injury": claim.Minor_Psychological_Injury,
                "dominant_injury": claim.Dominant_injury,
                "whiplash": claim.Whiplash
            },

            # Total claimed amount
            "total_claimed_amount": special_damages_total + general_damages_total
        }

        return Response(claim_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to retrieve claim details: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin updated multiple claim settlements and statuses.")
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_bulk_update_claims(request):
    """
    Bulk update claim statuses and settlement amounts.
    Also updates the models' acceptance/rejection counts when applicable.
    """
    try:
        updates = request.data.get('updates', [])
        if not isinstance(updates, list) or len(updates) == 0:
            return Response({
                "error": "Please provide a list of claim updates in the 'updates' field"
            }, status=status.HTTP_400_BAD_REQUEST)

        response_data = []
        # Get the claim IDs from the updates
        claim_ids = [int(update.get('claim_id')) for update in updates if update.get('claim_id')]

        # Query for claims - make sure we're using integers for comparison
        claims = UserClaim.objects.filter(user_claim_id__in=claim_ids)

        # Create a mapping of claim_id to claim for faster lookup
        # Convert claim_id to integer for consistent comparison
        claims_map = {int(claim.user_claim_id): claim for claim in claims}

        for update in updates:
            claim_id = update.get('claim_id')
            if not claim_id:
                continue  # Skip invalid entries

            # Convert claim_id to integer for consistent comparison with the mapping
            try:
                claim_id_int = int(claim_id)
                user_claim = claims_map.get(claim_id_int)
            except (ValueError, TypeError):
                response_data.append({
                    "claim_id": claim_id,
                    "error": "Invalid claim ID format",
                    "success": False
                })
                continue

            if not user_claim:
                response_data.append({
                    "claim_id": claim_id,
                    "error": "Claim not found",
                    "success": False
                })
                continue

            try:
                previous_status = user_claim.pending_claim
                claim_response = {"claim_id": claim_id, "success": True}

                # Check for status update
                new_status = update.get('status')
                if new_status:
                    if new_status not in ['pending', 'approved', 'rejected', 'settled']:
                        response_data.append({
                            "claim_id": claim_id,
                            "error": "Invalid status provided. Must be one of: pending, approved, rejected, settled",
                            "success": False
                        })
                        continue

                    user_claim.pending_claim = new_status

                    # Update model counts if status changed to approved or rejected
                    if previous_status == 'pending' and user_claim.model:
                        if new_status == 'approved':
                            user_claim.model.num_accepted_claims += 1
                            user_claim.model.save()
                        elif new_status == 'rejected':
                            user_claim.model.num_rejected_claims += 1
                            user_claim.model.save()

                # Check for settlement amount override
                new_settlement = update.get('settlement_amount')
                if new_settlement is not None:
                    try:
                        settlement_amount = Decimal(str(new_settlement))
                        user_claim.settled_amount = settlement_amount

                        if new_status == 'settled':
                            user_claim.predicted_settlement_value = settlement_amount
                    except (ValueError, TypeError):
                        response_data.append({
                            "claim_id": claim_id,
                            "error": "Invalid settlement amount provided",
                            "success": False
                        })
                        continue

                # Save changes
                user_claim.save()

                # Add to successful response
                claim_response.update({
                    "status": user_claim.pending_claim,
                    "settlement_amount": user_claim.settled_amount if hasattr(user_claim, 'settled_amount')
                                      else user_claim.predicted_settlement_value
                })

                if user_claim.model:
                    claim_response["model_info"] = {
                        "model_id": user_claim.model.model_id,
                        "model_name": user_claim.model.model_name,
                        "model_version": user_claim.model.model_version,
                        "num_accepted_claims": user_claim.model.num_accepted_claims,
                        "num_rejected_claims": user_claim.model.num_rejected_claims
                    }

                response_data.append(claim_response)

            except Exception as e:
                response_data.append({
                    "claim_id": claim_id,
                    "error": f"Failed to update claim: {str(e)}",
                    "success": False
                })

        return Response({
            "results": response_data,
            "total_updated": len([r for r in response_data if r.get('success')]),
            "total_failed": len([r for r in response_data if not r.get('success')])
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to process bulk update: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin searched for claims.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_search_claims(request):
    """
    Search for claims based on various criteria.
    """

    try:
        # Extract search parameters
        user_name = request.query_params.get('user_name', '')
        user_email = request.query_params.get('user_email', '')
        claim_id = request.query_params.get('claim_id', '')
        accident_type = request.query_params.get('accident_type', '')
        status = request.query_params.get('status', '')
        min_settlement = request.query_params.get('min_settlement', '')
        max_settlement = request.query_params.get('max_settlement', '')
        start_date = request.query_params.get('start_date', '')
        end_date = request.query_params.get('end_date', '')
        injury_type = request.query_params.get('injury_type', '')

        # Build query
        query = Q()

        if user_name:
            query &= Q(user__full_name__icontains=user_name)

        if user_email:
            query &= Q(user__email__icontains=user_email)

        if claim_id:
            query &= Q(user_claim_id=claim_id)

        if accident_type:
            query &= Q(user_accident__accident__accident_type__icontains=accident_type)

        if status:
            query &= Q(pending_claim=status)

        if min_settlement:
            query &= Q(predicted_settlement_value__gte=min_settlement)

        if max_settlement:
            query &= Q(predicted_settlement_value__lte=max_settlement)

        if start_date:
            try:
                start_date = timezone.datetime.strptime(start_date, '%Y-%m-%d')
                query &= Q(claim__claim_date__gte=start_date)
            except ValueError:
                pass

        if end_date:
            try:
                end_date = timezone.datetime.strptime(end_date, '%Y-%m-%d')
                # Add a day to include the end date fully
                end_date = end_date + timezone.timedelta(days=1)
                query &= Q(claim__claim_date__lt=end_date)
            except ValueError:
                pass

        if injury_type:
            query &= Q(claim__Dominant_injury__icontains=injury_type)

        # Execute search
        user_claims = UserClaim.objects.filter(query)

        # Apply sorting if provided
        sort_by = request.query_params.get('sort_by', 'claim__claim_date')
        sort_order = request.query_params.get('sort_order', 'desc')

        if sort_order.lower() == 'desc':
            sort_by = f"-{sort_by}"

        user_claims = user_claims.order_by(sort_by)

        # Apply pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        # Get total count before pagination
        total_count = user_claims.count()

        # Apply pagination
        user_claims = user_claims[start_idx:end_idx]

        claims_data = []
        for user_claim in user_claims:
            claims_data.append({
                "claim_id": user_claim.user_claim_id,
                "user_email": user_claim.user.email,
                "user_name": user_claim.user.full_name,
                "accident_type": user_claim.user_accident.accident.accident_type,
                "claim_date": user_claim.claim.claim_date,
                "status": user_claim.pending_claim,
                "predicted_settlement": user_claim.predicted_settlement_value,
                "dominant_injury": user_claim.claim.Dominant_injury
            })

        return Response({
            "claims": claims_data,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size  # Ceiling division
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to search claims: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin exported claims data.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_export_claims(request):
    """
    Export claims data for reporting and analysis.
    """
    # Check if user has admin role

    try:
        # Extract filter parameters
        status_filter = request.query_params.get('status', '')
        start_date = request.query_params.get('start_date', '')
        end_date = request.query_params.get('end_date', '')

        # Build query
        query = Q()

        if status_filter and status_filter != 'all':
            query &= Q(pending_claim=status_filter)

        if start_date:
            try:
                start_date = timezone.datetime.strptime(start_date, '%Y-%m-%d')
                query &= Q(claim__claim_date__gte=start_date)
            except ValueError:
                pass

        if end_date:
            try:
                end_date = timezone.datetime.strptime(end_date, '%Y-%m-%d')
                # Add a day to include the end date fully
                end_date = end_date + timezone.timedelta(days=1)
                query &= Q(claim__claim_date__lt=end_date)
            except ValueError:
                pass

        # Execute query
        user_claims = UserClaim.objects.filter(query)

        # Prepare export data
        export_data = []
        for user_claim in user_claims:
            claim = user_claim.claim
            user_accident = user_claim.user_accident

            export_data.append({
                "claim_id": user_claim.user_claim_id,
                "user_name": user_claim.user.full_name,
                "user_email": user_claim.user.email,
                "status": user_claim.pending_claim,
                "accident_type": user_accident.accident.accident_type,
                "accident_date": user_accident.accident_date,
                "claim_date": claim.claim_date,
                "predicted_settlement": user_claim.predicted_settlement_value,
                "dominant_injury": claim.Dominant_injury,
                "police_report_filed": claim.police_report_filed,
                "weather_conditions": user_accident.weather.weather_conditions,
                "vehicle_type": user_accident.user_vehicle.vehicle.vehicle_type,
                "vehicle_age": user_accident.user_vehicle.vehicle_age,
                "driver_age": user_accident.user_vehicle.driver.driver_age,
                "gender": user_accident.user_vehicle.driver.gender,
                "special_damages_total": sum([
                    claim.SpecialHealthExpenses,
                    claim.SpecialReduction,
                    claim.SpecialOverage,
                    claim.SpecialAdditionalInjury,
                    claim.SpecialEarningsLoss,
                    claim.SpecialUsageLoss,
                    claim.SpecialMedication,
                    claim.SpecialAssetDamage,
                    claim.SpecialRehabilitation,
                    claim.SpecialFixes,
                    claim.SpecialLoanerVehicle,
                    claim.SpecialTripCosts,
                    claim.SpecialJourneyExpenses,
                    claim.SpecialTherapy
                ]),
                "general_damages_total": sum([
                    claim.GeneralRest,
                    claim.GeneralFixed,
                    claim.GeneralUplift
                ])
            })

        return Response({
            "export_data": export_data,
            "export_count": len(export_data),
            "export_timestamp": timezone.now(),
            "filter_criteria": {
                "status": status_filter if status_filter else "all",
                "start_date": start_date.strftime('%Y-%m-%d') if isinstance(start_date, timezone.datetime) else None,
                "end_date": (end_date - timezone.timedelta(days=1)).strftime('%Y-%m-%d') if isinstance(end_date, timezone.datetime) else None
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Failed to export claims data: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_user_agent("Admin adjusted claim settlement value.")
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_adjust_settlement(request, claim_id):
    """
    Adjust the settlement value for a specific claim.
    This is a dedicated endpoint for settlement adjustments only.
    """
    try:
        user_claim = get_object_or_404(UserClaim, user_claim_id=claim_id)

        # Get settlement amount from request
        settlement_amount = request.data.get('settlement_amount')

        if settlement_amount is None:
            return Response({
                "error": "Settlement amount is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert to Decimal for precise financial calculations
            settlement_decimal = Decimal(str(settlement_amount))

            # Validate amount is positive
            if settlement_decimal < 0:
                return Response({
                    "error": "Settlement amount cannot be negative"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Update the settlement amount
            user_claim.settled_amount = settlement_decimal

            # Optionally capture reason for adjustment
            adjustment_reason = request.data.get('adjustment_reason')
            if adjustment_reason:
                if not hasattr(user_claim, 'admin_notes'):
                    user_claim.admin_notes = f"Settlement adjusted: {adjustment_reason}"
                else:
                    user_claim.admin_notes = f"{user_claim.admin_notes}\nSettlement adjusted: {adjustment_reason}"

            # Save changes
            user_claim.save()

            return Response({
                "message": "Settlement value adjusted successfully",
                "claim_id": user_claim.user_claim_id,
                "previous_predicted_settlement": user_claim.predicted_settlement_value,
                "new_settlement_amount": user_claim.settled_amount,
                "adjustment_difference": user_claim.settled_amount - user_claim.predicted_settlement_value
            }, status=status.HTTP_200_OK)

        except (ValueError, TypeError, DecimalException):
            return Response({
                "error": "Invalid settlement amount format"
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            "error": f"Failed to adjust settlement: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)