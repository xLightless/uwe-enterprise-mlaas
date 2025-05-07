import React, { useState, useEffect } from "react";
import { getUserClaims, getClaimDetails, submitClaimFeedback } from "../../../repositories/user-claims";

type ClaimDetails = {
    gender: string;
    driverAge: number;
    vehicleType: string;
    vehicleAge: number;
    passengers: number;
    exceptional: string;
    accidentType: string;
    accidentDate: string;
    weatherConditions: string;
    policeReport: string;
    witness: string;
    accidentDescription: string;
    dominantInjury: string;
    prognosis: number;
    whiplash: string;
    psychological: string;
    injuryDescription: string;
    assetDamage: number;
    earningsLoss: number;
    usageLoss: number;
    generalFixes: number;
    specialFixes: number;
    tripCosts: number;
    journeyExpenses: number;
    medications: number;
    rehabilitation: number;
    therapy: number;
    healthExpenses: number;
    specialReduction: number;
    specialOverage: number;
    generalRest: number;
    additionalInjury: number;
    generalUplift: number;
    loanerVehicle: number;
};

type Claim = {
    claimId: string;
    claimDate: string;
    settlementAmount: string;
    status: string;
    details: ClaimDetails;
};

const PastClaims: React.FC = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comments, setComments] = useState("");
    const [claimForRating, setClaimForRating] = useState<string | null>(null);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                setLoading(true);
                const response = await getUserClaims();
                console.log("Raw API response for past claims:", response);
                
                const transformedClaims = Array.isArray(response) ? response.map(claim => {
                    console.log("Processing past claim:", claim);
                    
                    const claimId = claim.id || claim.claim_id || claim.claimId || `claim-${Math.random().toString(36).substring(2, 10)}`;
                    
                    let settlementAmount = claim.settlement_amount || claim.settlementAmount || claim.predicted_settlement_value || 0;
                    if (typeof settlementAmount === 'number') {
                        settlementAmount = `£${settlementAmount}`;
                    }
                    
                    let status = claim.status || claim.pending_claim || 'pending';
                    
                    const claimDate = claim.date || claim.claimDate || claim['Claim Date'] || claim.claim_date || new Date().toISOString().split('T')[0];
                    
                    return {
                        claimId,
                        claimDate,
                        settlementAmount,
                        status,
                        details: {
                            gender: claim.Gender || claim.gender || 'N/A',
                            driverAge: Number(claim['Driver Age'] || claim.driverAge || claim.driver_age || 0),
                            vehicleType: claim['Vehicle Type'] || claim.vehicleType || claim.vehicle_type || 'N/A',
                            vehicleAge: Number(claim['Vehicle Age'] || claim.vehicleAge || claim.vehicle_age || 0),
                            passengers: Number(claim['Number of Passengers'] || claim.passengers || claim.passenger_count || 0),
                            exceptional: claim['Exceptional_Circumstances'] ? 'Yes' : 'No',
                            accidentType: claim.AccidentType || claim.accidentType || claim.accident_type || 'N/A',
                            accidentDate: claim['Accident Date'] || claim.accidentDate || claim.accident_date || 'N/A',
                            weatherConditions: claim['Weather Conditions'] || claim.weatherConditions || claim.weather_conditions || 'N/A',
                            policeReport: claim['Police Report Filed'] ? 'Yes' : 'No',
                            witness: claim['Witness Present'] ? 'Yes' : 'No',
                            accidentDescription: claim['Accident Description'] || claim.accidentDescription || claim.accident_description || 'N/A',
                            dominantInjury: claim['Dominant injury'] || claim.dominantInjury || claim.dominant_injury || 'N/A',
                            prognosis: Number(claim['Injury_Prognosis'] || claim.prognosis || claim.injury_prognosis || 0),
                            whiplash: claim.Whiplash ? 'Yes' : 'No',
                            psychological: claim['Minor_Psychological_Injury'] ? 'Yes' : 'No',
                            injuryDescription: claim['Injury Description'] || claim.injuryDescription || claim.injury_description || 'N/A',
                            assetDamage: Number(claim.SpecialAssetDamage || claim.assetDamage || claim.asset_damage || 0),
                            earningsLoss: Number(claim.SpecialEarningsLoss || claim.earningsLoss || claim.earnings_loss || 0),
                            usageLoss: Number(claim.SpecialUsageLoss || claim.usageLoss || claim.usage_loss || 0),
                            generalFixes: Number(claim.GeneralFixed || claim.generalFixes || claim.general_fixes || 0),
                            specialFixes: Number(claim.SpecialFixes || claim.specialFixes || claim.special_fixes || 0),
                            tripCosts: Number(claim.SpecialTripCosts || claim.tripCosts || claim.trip_costs || 0),
                            journeyExpenses: Number(claim.SpecialJourneyExpenses || claim.journeyExpenses || claim.journey_expenses || 0),
                            medications: Number(claim.SpecialMedication || claim.medications || claim.medication_costs || 0),
                            rehabilitation: Number(claim.SpecialRehabilitation || claim.rehabilitation || claim.rehab_costs || 0),
                            therapy: Number(claim.SpecialTherapy || claim.therapy || claim.therapy_costs || 0),
                            healthExpenses: Number(claim.SpecialHealthExpenses || claim.healthExpenses || claim.health_expenses || 0),
                            specialReduction: Number(claim.SpecialReduction || claim.specialReduction || claim.special_reduction || 0),
                            specialOverage: Number(claim.SpecialOverage || claim.specialOverage || claim.special_overage || 0),
                            generalRest: Number(claim.GeneralRest || claim.generalRest || claim.general_rest || 0),
                            additionalInjury: Number(claim.SpecialAdditionalInjury || claim.additionalInjury || claim.additional_injury || 0),
                            generalUplift: Number(claim.GeneralUplift || claim.generalUplift || claim.general_uplift || 0),
                            loanerVehicle: Number(claim.SpecialLoanerVehicle || claim.loanerVehicle || claim.loaner_vehicle || 0)
                        }
                    };
                }) : [];
                
                const pastClaims = transformedClaims.filter(claim => 
                    claim.status === 'settled' || claim.status === 'rejected'
                );
                
                setClaims(pastClaims);
                
                if (pastClaims.length === 0) {
                    console.log("No past claims found from API");
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching past claims:", err);
                setError("Failed to load claims history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchClaims();
    }, []);

    const handleViewDetails = async (claim: Claim) => {
        try {
            setLoading(true);
            try {
                const detailedClaim = await getClaimDetails(claim.claimId);
                setSelectedClaim(detailedClaim);
            } catch (detailErr) {
                console.warn("Could not fetch detailed claim info:", detailErr);
                setSelectedClaim(claim);
            }
        } catch (err) {
            console.error("Error processing claim details:", err);
            alert("Failed to load claim details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setSelectedClaim(null);
    };

    const handleOpenRatingPopup = (claimId: string) => {
        setClaimForRating(claimId);
        setIsRatingPopupOpen(true);
    };

    const handleCloseRatingPopup = () => {
        setIsRatingPopupOpen(false);
        setRating(null);
        setComments("");
        setClaimForRating(null);
    };

    const handleSubmitRating = async () => {
        if (!claimForRating || !rating) return;
        
        try {
            setSubmittingFeedback(true);
            
            await submitClaimFeedback(claimForRating, {
                rating,
                comments
            });
            
            alert("Thank you for your feedback!");
            handleCloseRatingPopup();
        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    return (
        <div className="container-primary bg-gray-50 p-6">
            <div className="flex flex-col gap-5 mb-8 max-w-[800px] mx-auto">
                <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                        <p className="text-white font-bold text-xl">Claims History</p>
                        <p className="text-blue-100 text-sm">View your settled claims and provide feedback</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-medium">Loading claims history...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-500 font-medium">{error}</p>
                            </div>
                        ) : claims.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-medium">No past claims found</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {claims.map((claim) => (
                                    <div key={claim.claimId} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                                        <div className="flex flex-col gap-3 mb-3 lg:mb-0 w-full">
                                            <div className="flex flex-row items-center gap-2 self-start">
                                                <div className={`w-2 h-2 rounded-full ${claim.status === 'settled' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="font-bold text-lg">{claim.claimId}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${claim.status === 'settled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {claim.status === 'settled' ? 'Settled' : 'Rejected'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-col gap-x-8 gap-y-1 mt-2 text-center lg:text-left">
                                                <p className="text-sm text-gray-600"><span className="font-bold">Date:</span> {claim.claimDate}</p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-bold">Settlement:</span> 
                                                    <span className={`font-bold ${claim.status === 'settled' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {claim.settlementAmount}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row justify-center lg:justify-end gap-3 self-center lg:w-full">
                                            <button 
                                                onClick={() => handleViewDetails(claim)} 
                                                className="cursor-pointer py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                onClick={() => handleOpenRatingPopup(claim.claimId)} 
                                                className="cursor-pointer py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Leave Feedback
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedClaim && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100] overflow-auto">
                    <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Claim Details</p>
                            <p className="text-blue-100 text-sm">Claim ID: {selectedClaim.claimId}</p>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {selectedClaim.details ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="col-span-2 mb-2">
                                    <p className="font-bold text-white border-b p-2 rounded-lg bg-blue-500">Personal Information</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Driver Gender</p>
                                    <p className="font-medium">{selectedClaim.details.gender}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Driver Age</p>
                                    <p className="font-medium">{selectedClaim.details.driverAge}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Vehicle Type</p>
                                    <p className="font-medium">{selectedClaim.details.vehicleType}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Vehicle Age</p>
                                    <p className="font-medium">{selectedClaim.details.vehicleAge} years</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Number of Passengers</p>
                                    <p className="font-medium">{selectedClaim.details.passengers}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Exceptional Circumstances</p>
                                    <p className="font-medium">{selectedClaim.details.exceptional}</p>
                                </div>

                                <div className="col-span-2 mt-4 mb-2">
                                    <p className="font-bold text-white border-b p-2 rounded-lg bg-blue-500">Accident Information</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Accident Type</p>
                                    <p className="font-medium">{selectedClaim.details.accidentType}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Accident Date</p>
                                    <p className="font-medium">{selectedClaim.details.accidentDate}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Weather Conditions</p>
                                    <p className="font-medium">{selectedClaim.details.weatherConditions}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Police Report Filed</p>
                                    <p className="font-medium">{selectedClaim.details.policeReport}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Witness Present</p>
                                    <p className="font-medium">{selectedClaim.details.witness}</p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-gray-600 text-sm font-semibold">Accident Description</p>
                                    <p className="font-medium">{selectedClaim.details.accidentDescription}</p>
                                </div>

                                <div className="col-span-2 mt-4 mb-2">
                                    <p className="font-bold text-white border-b p-2 rounded-lg bg-blue-500">Injury Information</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Dominant Injury</p>
                                    <p className="font-medium">{selectedClaim.details.dominantInjury}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Injury Prognosis</p>
                                    <p className="font-medium">{selectedClaim.details.prognosis} months</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Whiplash</p>
                                    <p className="font-medium">{selectedClaim.details.whiplash}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Minor Psychological Injury</p>
                                    <p className="font-medium">{selectedClaim.details.psychological}</p>
                                </div>
                                
                                <div className="col-span-2">
                                    <p className="text-gray-600 text-sm font-semibold">Injury Description</p>
                                    <p className="font-medium">{selectedClaim.details.injuryDescription}</p>
                                </div>

                                <div className="col-span-2 mt-4 mb-2">
                                    <p className="font-bold text-white border-b p-2 rounded-lg bg-blue-500">Financial Information</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Asset Damage</p>
                                    <p className="font-medium">£{selectedClaim.details.assetDamage}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Earnings Loss</p>
                                    <p className="font-medium">£{selectedClaim.details.earningsLoss}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Usage Loss</p>
                                    <p className="font-medium">£{selectedClaim.details.usageLoss}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">General Fixes</p>
                                    <p className="font-medium">£{selectedClaim.details.generalFixes}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Special Fixes</p>
                                    <p className="font-medium">£{selectedClaim.details.specialFixes}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Trip Costs</p>
                                    <p className="font-medium">£{selectedClaim.details.tripCosts}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Journey Expenses</p>
                                    <p className="font-medium">£{selectedClaim.details.journeyExpenses}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Medications</p>
                                    <p className="font-medium">£{selectedClaim.details.medications}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Rehabilitation</p>
                                    <p className="font-medium">£{selectedClaim.details.rehabilitation}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Therapy</p>
                                    <p className="font-medium">£{selectedClaim.details.therapy}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Health Expenses</p>
                                    <p className="font-medium">£{selectedClaim.details.healthExpenses}</p>
                                </div>

                                <div className="col-span-2 mt-4 mb-2">
                                    <p className="font-bold text-white border-b p-2 rounded-lg bg-blue-500">Additional Adjustments</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Special Reduction</p>
                                    <p className="font-medium">£{selectedClaim.details.specialReduction}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Special Overage</p>
                                    <p className="font-medium">£{selectedClaim.details.specialOverage}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">General Rest</p>
                                    <p className="font-medium">£{selectedClaim.details.generalRest}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Additional Injury</p>
                                    <p className="font-medium">£{selectedClaim.details.additionalInjury}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">General Uplift</p>
                                    <p className="font-medium">£{selectedClaim.details.generalUplift}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">Loaner Vehicle</p>
                                    <p className="font-medium">£{selectedClaim.details.loanerVehicle}</p>
                                </div>
                                
                                <div className="col-span-2 mt-4 mb-2">
                                    <p className="font-bold text-white border-b p-2 rounded-lg bg-blue-500">Settlement Information</p>
                                </div>
                                
                                <div className="col-span-2">
                                    <p className="text-gray-600 text-sm font-semibold">Settlement Amount</p>
                                    <p className={`font-bold text-lg ${selectedClaim.status === 'settled' ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedClaim.settlementAmount}
                                    </p>
                                </div>

                                {selectedClaim.status === 'rejected' && (
                                    <div className="col-span-2">
                                        <p className="text-gray-600 text-sm font-semibold">Status</p>
                                        <p className="font-medium text-red-600">This claim was rejected</p>
                                    </div>
                                )}
                            </div>
                            ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-500 font-medium">No detailed information available for this claim</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <button onClick={handleCloseDetails} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isRatingPopupOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100]">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Provide Feedback</p>
                            <p className="text-blue-100 text-sm">Help us improve our service</p>
                        </div>
                        
                        <div className="p-6">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmitRating(); }}>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="rating">Your Rating</label>
                                    <select 
                                        id="rating"
                                        value={rating || ""}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="" disabled hidden>Select a rating</option>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="comments">Your Comments</label>
                                    <textarea 
                                        id="comments"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Please share your experience with the claim process..."
                                        rows={5}
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                    />
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                            <button 
                                onClick={handleCloseRatingPopup} 
                                className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors"
                                disabled={submittingFeedback}
                            >
                                Cancel
                            </button>
                            
                            <button 
                                onClick={handleSubmitRating}
                                disabled={!rating || submittingFeedback}
                                className={`py-2 px-6 rounded-lg font-medium transition-colors ${
                                    rating && !submittingFeedback 
                                        ? 'cursor-pointer bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PastClaims;