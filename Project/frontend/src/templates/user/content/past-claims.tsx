import React, { useState } from "react";

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
    details: ClaimDetails;
};

const dummyClaims: Claim[] = [
    {
        claimId: "CLM001",
        claimDate: "2023-09-15",
        settlementAmount: "£5,000",
        details: {
            gender: "Male",
            driverAge: 35,
            vehicleType: "Car",
            vehicleAge: 5,
            passengers: 2,
            exceptional: "No",
            accidentType: "Rear-end collision",
            accidentDate: "2023-09-10",
            weatherConditions: "Rainy",
            policeReport: "Yes",
            witness: "Yes",
            accidentDescription: "The car was rear-ended at a traffic light.",
            dominantInjury: "Arms",
            prognosis: 3,
            whiplash: "Yes",
            psychological: "No",
            injuryDescription: "Big big ouchie on the arms.",
            assetDamage: 2000,
            earningsLoss: 1000,
            usageLoss: 500,
            generalFixes: 1500,
            specialFixes: 0,
            tripCosts: 0,
            journeyExpenses: 0,
            medications: 200,
            rehabilitation: 300,
            therapy: 0,
            healthExpenses: 450,
            specialReduction: 80,
            specialOverage: 200, 
            generalRest: 350,
            additionalInjury: 750,
            generalUplift: 300,
            loanerVehicle: 450
        },
    },

    {
        claimId: "CLM002",
        claimDate: "2023-08-20",
        settlementAmount: "£3,200",
        details: {
            gender: "Female",
            driverAge: 28,
            vehicleType: "Motorcycle",
            vehicleAge: 2,
            passengers: 0,
            exceptional: "No",
            accidentType: "Side collision",
            accidentDate: "2023-08-15",
            weatherConditions: "Sunny",
            policeReport: "Yes",
            witness: "No",
            accidentDescription: "A car hit the motorcycle from the side at an intersection.",
            dominantInjury: "Legs",
            prognosis: 6,
            whiplash: "No",
            psychological: "Yes",
            injuryDescription: "Severe brainrot.",
            assetDamage: 1000,
            earningsLoss: 500,
            usageLoss: 200,
            generalFixes: 1200,
            specialFixes: 0,
            tripCosts: 100,
            journeyExpenses: 50,
            medications: 150,
            rehabilitation: 400,
            therapy: 300,
            healthExpenses: 350,
            specialReduction: 60,
            specialOverage: 180,
            generalRest: 320,
            additionalInjury: 600,
            generalUplift: 240,
            loanerVehicle: 400
        },
    },
];

const PastClaims: React.FC = () => {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [comments, setComments] = useState("");

    const handleViewDetails = (claim: Claim) => {
        setSelectedClaim(claim);
    };

    const handleCloseDetails = () => {
        setSelectedClaim(null);
    };

    const handleOpenRatingPopup = () => {
        setIsRatingPopupOpen(true);
    };

    const handleCloseRatingPopup = () => {
        setIsRatingPopupOpen(false);
        setRating(null);
        setComments("");
    };

    const handleSubmitRating = () => {
        alert("Thank you for your feedback!");
        handleCloseRatingPopup();
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
                        {dummyClaims.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-medium">No past claims found</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {dummyClaims.map((claim) => (
                                    <div key={claim.claimId} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                                        <div className="flex flex-col gap-3 mb-3 lg:mb-0 w-full">
                                            <div className="flex flex-row items-center gap-2 self-start">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="font-bold text-lg">{claim.claimId}</span>
                                            </div>
                                            
                                            <div className="flex flex-col gap-x-8 gap-y-1 mt-2 text-center lg:text-left">
                                                <p className="text-sm text-gray-600"><span className="font-bold">Date:</span> {claim.claimDate}</p>
                                                <p className="text-sm text-gray-600"><span className="font-bold">Settlement:</span> <span className="font-bold text-green-600">{claim.settlementAmount}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row justify-center lg:justify-end gap-3 self-center lg:w-full">
                                            <button onClick={() => handleViewDetails(claim)} className="cursor-pointer py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">View Details</button>
                                            <button onClick={handleOpenRatingPopup} className="cursor-pointer py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">Leave Feedback</button>
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
                                    <p className="font-bold text-green-600 text-lg">{selectedClaim.settlementAmount}</p>
                                </div>
                            </div>
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
                            <form className="space-y-6">
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
                            <button onClick={handleCloseRatingPopup} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                            
                            <button 
                                onClick={handleSubmitRating}
                                className={`py-2 px-6 rounded-lg font-medium transition-colors ${rating ? 'cursor-pointer bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                disabled={!rating}
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PastClaims;