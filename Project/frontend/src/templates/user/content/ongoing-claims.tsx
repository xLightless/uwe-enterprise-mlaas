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

const ongoingClaim: Claim = {
    claimId: "CLM003",
    claimDate: "2023-10-01",
    settlementAmount: "Pending",
    details: {
        gender: "Male",
        driverAge: 40,
        vehicleType: "Truck",
        vehicleAge: 8,
        passengers: 1,
        exceptional: "Yes",
        accidentType: "Head-on collision",
        accidentDate: "2023-09-28",
        weatherConditions: "Snowy",
        policeReport: "Yes",
        witness: "No",
        accidentDescription: "The truck collided head-on with another vehicle on a snowy road.",
        dominantInjury: "Legs",
        prognosis: 4,
        whiplash: "No",
        psychological: "Yes",
        injuryDescription: "Big booboo on the leg.",
        assetDamage: 5000,
        earningsLoss: 2000,
        usageLoss: 1000,
        generalFixes: 3000,
        specialFixes: 0,
        tripCosts: 200,
        journeyExpenses: 100,
        medications: 300,
        rehabilitation: 500,
        therapy: 400,
        healthExpenses: 750,
        specialReduction: 120,
        specialOverage: 350,
        generalRest: 600,
        additionalInjury: 1200,
        generalUplift: 450,
        loanerVehicle: 800
    },
};

const OngoingClaims: React.FC = () => {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [isRefusePopupOpen, setIsRefusePopupOpen] = useState(false);
    const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
    const [refuseComments, setRefuseComments] = useState("");

    const handleViewDetails = (claim: Claim) => {
        setSelectedClaim(claim);
    };

    const handleCloseDetails = () => {
        setSelectedClaim(null);
    };

    const handleOpenUploadPopup = () => {
        setIsUploadPopupOpen(true);
    };

    const handleCloseUploadPopup = () => {
        setIsUploadPopupOpen(false);
    };

    const handleOpenRefusePopup = () => {
        setIsRefusePopupOpen(true);
    };

    const handleCloseRefusePopup = () => {
        setIsRefusePopupOpen(false);
        setRefuseComments("");
    };

    const handleOpenAcceptPopup = () => {
        setIsAcceptPopupOpen(true);
    };

    const handleCloseAcceptPopup = () => {
        setIsAcceptPopupOpen(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" uploaded successfully.`);
            handleCloseUploadPopup();
        }
    };

    const handleRefuseClaim = () => {
        alert("Claim refused successfully.");
        handleCloseRefusePopup();
    };

    const handleAcceptClaim = () => {
        alert("Claim accepted successfully.");
        handleCloseAcceptPopup();
    };

    return (
        <div className="container-primary bg-gray-50 p-6">
            <div className="flex flex-col gap-5 mb-8 max-w-[800px] mx-auto">
                <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                        <p className="text-white font-bold text-xl">Active Claims</p>
                        <p className="text-blue-100 text-sm">Claims currently being processed</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {ongoingClaim ? (
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                                <div className="flex flex-col gap-3 mb-3 lg:mb-0 w-full">
                                    <div className="flex flex-row items-center gap-2 self-start">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="font-bold text-lg">{ongoingClaim.claimId}</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-x-8 gap-y-1 mt-2 text-center lg:text-left">
                                        <p className="text-sm text-gray-600"><span className="font-bold">Date:</span> {ongoingClaim.claimDate}</p>
                                        <p className="text-sm text-gray-600"><span className="font-bold">Settlement:</span> <span className="font-bold text-yellow-600">{ongoingClaim.settlementAmount}</span></p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center lg:justify-end gap-3 w-full">
                                    <button onClick={() => handleViewDetails(ongoingClaim)} className="cursor-pointer py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">View Details</button>
                                    <button onClick={handleOpenUploadPopup} className="cursor-pointer py-2 px-4 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors">Upload Evidence</button>

                                    <div className="flex flex-row gap-3">
                                        <button onClick={handleOpenAcceptPopup} className="cursor-pointer py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">Accept</button>
                                        <button onClick={handleOpenRefusePopup} className="cursor-pointer py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">Refuse</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-medium">No ongoing claims found</p>
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

            {isUploadPopupOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100]">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Upload Supporting Evidence</p>
                            <p className="text-blue-100 text-sm">Provide additional documentation for your claim</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="file">Select a file to upload</label>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                                    <input id="file" type="file" onChange={handleFileUpload} className="hidden"/>
                                    
                                    <label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-white"></div>
                                        </div>
                                        
                                        <span className="text-blue-500 font-medium mb-1">Click to select a file</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-center gap-3">
                            <button onClick={handleCloseUploadPopup} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isRefusePopupOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100]">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-400 to-red-600 p-4">
                            <p className="text-white font-bold text-xl">Refuse Claim</p>
                            <p className="text-red-100 text-sm">Are you sure you want to refuse this claim?</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="mb-4">
                                <p className="text-gray-700 mb-4">By refusing this claim, you disagree with the proposed settlement. Please explain your reasons and provide any supporting documentation.</p>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                                    <input id="refuseFile" type="file" className="hidden" onChange={handleFileUpload}/>
                                    
                                    <label htmlFor="refuseFile" className="cursor-pointer flex items-center justify-center p-2 py-5 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
                                        <div className="h-2 w-2 bg-gray-600 rounded-full mr-2"></div>
                                        <span className="text-gray-600 text-sm">Attach supporting documentation (optional)</span>
                                    </label>
                                </div>
                                
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="refuseReason">Reason for Refusal</label>
                                <textarea 
                                    id="refuseReason"
                                    value={refuseComments} 
                                    onChange={(e) => setRefuseComments(e.target.value)}
                                    placeholder="Please explain why you are refusing this claim..."
                                    rows={4}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                />
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between gap-3">
                            <button onClick={handleCloseRefusePopup} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleRefuseClaim} className="cursor-pointer py-2 px-6 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {isAcceptPopupOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100]">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 p-4">
                            <p className="text-white font-bold text-xl">Accept Claim</p>
                            <p className="text-green-100 text-sm">Confirm your acceptance of this claim</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        <p className="text-green-700 font-medium">You are about to accept the proposed settlement for claim {ongoingClaim.claimId}</p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-700 mb-4">By accepting this claim, you agree to the following terms:</p>
                                
                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 mb-4">
                                    <li>You agree to the proposed settlement amount</li>
                                    <li>You will not seek further compensation for this incident</li>
                                    <li>You acknowledge all information provided is accurate</li>
                                </ul>
                                
                                <p className="text-gray-700">Are you sure you want to accept this claim?</p>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between gap-3">
                            <button onClick={handleCloseAcceptPopup} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleAcceptClaim} className="cursor-pointer py-2 px-6 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OngoingClaims;