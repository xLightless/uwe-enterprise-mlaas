import React, { useState } from "react";

const ongoingClaim = {
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
        weatherConditions: "snowy",
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
    },
};

const OngoingClaims: React.FC = () => {
    const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

    const handleViewDetails = (claim: any) => {
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" uploaded successfully.`);
            handleCloseUploadPopup();
        }
    };

    return (
        <div className="container-primary p-5">
            <p className="text-2xl font-bold p-2 mb-5 rounded-md text-white bg-gray-500">Ongoing Claims</p>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center gap-5 p-5 border rounded-md shadow-sm bg-white">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <p className="font-bold">Claim ID: {ongoingClaim.claimId}</p>
                        <p className="font-bold">Claim Date: {ongoingClaim.claimDate}</p>
                        <p className="font-bold">Settlement Amount: {ongoingClaim.settlementAmount}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3">
                        <button onClick={() => handleViewDetails(ongoingClaim)} className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-400">Details</button>

                        <button onClick={handleOpenUploadPopup} className="cursor-pointer px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-400">Upload Evidence</button>
                    </div>
                </div>
            </div>

            {selectedClaim && (
                <div className="fixed inset-0 flex justify-center items-center p-5 overlay/20 backdrop-blur-sm z-50 overflow-auto">
                    <div className="p-5 pt-10 max-w-2xl w-full rounded-md shadow-lg border bg-white">
                        <h2 className="text-xl font-bold mb-4">Claim Details</h2>

                        <div className="flex flex-col gap-2">
                            <p><strong>Driver Gender:</strong> {selectedClaim.details.gender}</p>
                            <p><strong>Driver Age:</strong> {selectedClaim.details.driverAge}</p>
                            <p><strong>Vehicle Type:</strong> {selectedClaim.details.vehicleType}</p>
                            <p><strong>Vehicle Age:</strong> {selectedClaim.details.vehicleAge}</p>
                            <p><strong>Number of Passengers:</strong> {selectedClaim.details.passengers}</p>
                            <p><strong>Exceptional Circumstances:</strong> {selectedClaim.details.exceptional}</p>
                            <p><strong>Accident Type:</strong> {selectedClaim.details.accidentType}</p>
                            <p><strong>Accident Date:</strong> {selectedClaim.details.accidentDate}</p>
                            <p><strong>Weather Conditions:</strong> {selectedClaim.details.weatherConditions}</p>
                            <p><strong>Police Report Filed:</strong> {selectedClaim.details.policeReport}</p>
                            <p><strong>Witness Present:</strong> {selectedClaim.details.witness}</p>
                            <p><strong>Accident Description:</strong> {selectedClaim.details.accidentDescription}</p>
                            <p><strong>Dominant Injury:</strong> {selectedClaim.details.dominantInjury}</p>
                            <p><strong>Injury Prognosis:</strong> {selectedClaim.details.prognosis} months</p>
                            <p><strong>Whiplash:</strong> {selectedClaim.details.whiplash}</p>
                            <p><strong>Minor Psychological Injury:</strong> {selectedClaim.details.psychological}</p>
                            <p><strong>Injury Description:</strong> {selectedClaim.details.injuryDescription}</p>
                            <p><strong>Damage to Assets:</strong> £{selectedClaim.details.assetDamage}</p>
                            <p><strong>Earnings Loss:</strong> £{selectedClaim.details.earningsLoss}</p>
                            <p><strong>Usage Loss:</strong> £{selectedClaim.details.usageLoss}</p>
                            <p><strong>Cost of General Fixes:</strong> £{selectedClaim.details.generalFixes}</p>
                            <p><strong>Cost of Special Fixes:</strong> £{selectedClaim.details.specialFixes}</p>
                            <p><strong>Trip Costs:</strong> £{selectedClaim.details.tripCosts}</p>
                            <p><strong>Journey Expenses:</strong> £{selectedClaim.details.journeyExpenses}</p>
                            <p><strong>Cost of Medications:</strong> £{selectedClaim.details.medications}</p>
                            <p><strong>Cost of Rehabilitation:</strong> £{selectedClaim.details.rehabilitation}</p>
                            <p><strong>Cost of Therapy:</strong> £{selectedClaim.details.therapy}</p>
                        </div>

                        <button onClick={handleCloseDetails} className="cursor-pointer mt-4 text-white px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-400">Close</button>
                    </div>
                </div>
            )}

            {isUploadPopupOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 overlay/20 backdrop-blur-sm z-50">
                    <div className="p-5 max-w-md w-full rounded-md shadow-lg border bg-white">
                        <h2 className="text-xl font-bold mb-4">Upload Supporting Evidence</h2>

                        <input type="file" onChange={handleFileUpload} className="cursor-pointer block w-full file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100"/>
                        
                        <button onClick={handleCloseUploadPopup} className="cursor-pointer mt-4 text-white px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-400">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OngoingClaims;