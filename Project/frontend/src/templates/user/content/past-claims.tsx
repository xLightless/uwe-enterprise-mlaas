import React, { useState } from "react";

const dummyClaims = [
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
        },
    },
];

const PastClaims: React.FC = () => {
    const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

    const handleViewDetails = (claim: any) => {
        setSelectedClaim(claim);
    };

    const handleCloseDetails = () => {
        setSelectedClaim(null);
    };

    return (
        <div className="container-primary p-5">
            <p className="text-2xl font-bold p-2 mb-5 rounded-md text-white bg-gray-500">Past Claims</p>

            <div className="flex flex-col gap-4">
                {dummyClaims.map((claim) => (
                    <div key={claim.claimId} className="flex justify-between items-center p-5 border rounded-md shadow-sm bg-white">
                        <div className="flex flex-col lg:flex-row gap-3">
                            <p className="font-bold">Claim ID: {claim.claimId}</p>
                            <p className="font-bold">Claim Date: {claim.claimDate}</p>
                            <p className="font-bold">Settlement Amount: {claim.settlementAmount}</p>
                        </div>

                        <button onClick={() => handleViewDetails(claim)} className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-400">Details</button>
                    </div>
                ))}
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
        </div>
    );
};

export default PastClaims;