import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitClaim, ClaimSubmission } from "../../../repositories/user-claims";

const SubmitClaim: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [currentForm, setcurrentForm] = useState(1);
    const [formData, setFormData] = useState({
        gender: "",
        driverAge: "",
        vehicleType: "",
        vehicleAge: "",
        passengers: "",
        exceptional: "",
        accidentType: "",
        accidentDate: "",
        weatherConditions: "",
        policeReport: "",
        witness: "",
        accidentDescription: "",
        dominantInjury: "",
        prognosis: "",
        whiplash: "",
        psychological: "",
        injuryDescription: "",
        assetDamage: "",
        earningsLoss: "",
        usageLoss: "",
        generalFixes: "",
        specialFixes: "",
        tripCosts: "",
        journeyExpenses: "",
        medications: "",
        rehabilitation: "",
        therapy: "",
        healthExpenses: "",
        specialReduction: "",
        specialOverage: "",
        generalRest: "",
        additionalInjury: "",
        generalUplift: "",
        loanerVehicle: ""
    });

    const handleSubmitClaim = async () => {
        try {
            setIsSubmitting(true);
            setSubmissionError(null);
            
            const claimData: ClaimSubmission = {
                gender: formData.gender,
                driverAge: Number(formData.driverAge),
                vehicleType: formData.vehicleType, 
                vehicleAge: Number(formData.vehicleAge),
                passengers: Number(formData.passengers),
                exceptional: formData.exceptional,
                accidentType: formData.accidentType,
                accidentDate: formData.accidentDate,
                weatherConditions: formData.weatherConditions,
                policeReport: formData.policeReport,
                witness: formData.witness,
                accidentDescription: formData.accidentDescription,
                dominantInjury: formData.dominantInjury,
                prognosis: Number(formData.prognosis),
                whiplash: formData.whiplash,
                psychological: formData.psychological,
                injuryDescription: formData.injuryDescription,
                assetDamage: Number(formData.assetDamage),
                earningsLoss: Number(formData.earningsLoss),
                usageLoss: Number(formData.usageLoss),
                generalFixes: Number(formData.generalFixes),
                specialFixes: Number(formData.specialFixes),
                tripCosts: Number(formData.tripCosts),
                journeyExpenses: Number(formData.journeyExpenses),
                medications: Number(formData.medications),
                rehabilitation: Number(formData.rehabilitation),
                therapy: Number(formData.therapy),
                healthExpenses: Number(formData.healthExpenses),
                specialReduction: Number(formData.specialReduction),
                specialOverage: Number(formData.specialOverage),
                generalRest: Number(formData.generalRest),
                additionalInjury: Number(formData.additionalInjury),
                generalUplift: Number(formData.generalUplift),
                loanerVehicle: Number(formData.loanerVehicle)
            };
            
            const response = await submitClaim(claimData);
            console.log("Claim submitted successfully:", response);
            
            alert("Claim submitted successfully!");
            navigate("/user-dashboard/");
        } catch (error) {
            console.error("Error submitting claim:", error);
            if (error instanceof Error) {
                setSubmissionError(error.message || "An error occurred while submitting your claim.");
            } else {
                setSubmissionError("An error occurred while submitting your claim.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextForm = () => {
        setcurrentForm((prev) => prev + 1);
    };

    const prevForm = () => {
        setcurrentForm((prev) => prev - 1);
    };

    const isFormComplete = () => {
        return Object.values(formData).every((value) => value !== "");
    };
    
    const formSteps = [
        "Personal Details",
        "Accident Information",
        "Injury Assessment",
        "Financial Impact",
        "Review & Submit"
    ];

    const accidentTypes = [
        "Rear end",
        "Rear end - Clt pushed into next vehicle",
        "Rear end - 3 car - Clt at front",
        "Other side pulled out of side road",
        "Other side pulled on to roundabout",
        "Other side drove on wrong side of the road",
        "Other side reversed into Clt's vehicle",
        "Other side changed lanes and collided with clt's vehicle",
        "Other side changed lanes on a roundabout colliding with clt's vehicle"
    ];

    const renderForm = () => {
        switch (currentForm) {
            case 1:
                return (
                    <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Basic Details</p>
                            <p className="text-blue-100 text-sm">Please provide information about the driver and vehicle</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="gender">Driver Gender</label>
                                    <select 
                                        name="gender" 
                                        value={formData.gender} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="driverAge">Driver Age</label>
                                    <input 
                                        type="number" 
                                        name="driverAge" 
                                        value={formData.driverAge} 
                                        onChange={handleInputChange} 
                                        placeholder="Driver Age..." 
                                        min="18" 
                                        max="99" 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="vehicleType">Vehicle Type</label>
                                    <select 
                                        name="vehicleType" 
                                        value={formData.vehicleType} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="car">Car</option>
                                        <option value="motorcycle">Motorcycle</option>
                                        <option value="truck">Truck</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="vehicleAge">Vehicle Age</label>
                                    <input 
                                        type="number" 
                                        name="vehicleAge" 
                                        value={formData.vehicleAge} 
                                        onChange={handleInputChange} 
                                        placeholder="Vehicle Age..." 
                                        min="0" 
                                        max="99" 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="passengers">Number of Passengers</label>
                                    <input 
                                        type="number" 
                                        name="passengers" 
                                        value={formData.passengers} 
                                        onChange={handleInputChange} 
                                        placeholder="Number of Passengers..." 
                                        min="0" 
                                        max="99" 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="exceptional">Exceptional Circumstances</label>
                                    <select 
                                        name="exceptional" 
                                        value={formData.exceptional} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Accident Details</p>
                            <p className="text-blue-100 text-sm">Tell us about the accident circumstances</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="accidentType">Accident Type</label>
                                    <select 
                                        name="accidentType" 
                                        value={formData.accidentType} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        {accidentTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="accidentDate">Accident Date</label>
                                    <input 
                                        type="datetime-local" 
                                        name="accidentDate" 
                                        value={formData.accidentDate} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="weatherConditions">Weather Conditions</label>
                                    <select 
                                        name="weatherConditions" 
                                        value={formData.weatherConditions} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="sunny">Sunny</option>
                                        <option value="rainy">Rainy</option>
                                        <option value="snowy">Snowy</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="policeReport">Police Report Filed</label>
                                    <select 
                                        name="policeReport" 
                                        value={formData.policeReport} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="witness">Witness Present</label>
                                    <select 
                                        name="witness" 
                                        value={formData.witness} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-2 col-span-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="accidentDescription">Accident Description</label>
                                <textarea 
                                    name="accidentDescription" 
                                    value={formData.accidentDescription} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter Accident Description..." 
                                    rows={4}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Injury Details</p>
                            <p className="text-blue-100 text-sm">Information about injuries sustained</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="dominantInjury">Dominant Injury</label>
                                    <select 
                                        name="dominantInjury" 
                                        value={formData.dominantInjury} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="arms">Arms</option>
                                        <option value="legs">Legs</option>
                                        <option value="hips">Hips</option>
                                        <option value="multiple">Multiple</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="prognosis">Injury Prognosis (months)</label>
                                    <input 
                                        type="number" 
                                        name="prognosis" 
                                        value={formData.prognosis} 
                                        onChange={handleInputChange} 
                                        placeholder="Recovery time in months..." 
                                        min="0" 
                                        max="100" 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="whiplash">Whiplash</label>
                                    <select 
                                        name="whiplash" 
                                        value={formData.whiplash} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="psychological">Minor Psychological Injury</label>
                                    <select 
                                        name="psychological" 
                                        value={formData.psychological} 
                                        onChange={handleInputChange} 
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                                    >
                                        <option value="" disabled hidden>Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="injuryDescription">Injury Description</label>
                                <textarea 
                                    name="injuryDescription" 
                                    value={formData.injuryDescription} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter Injury Description..." 
                                    rows={4}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                />
                            </div>
                        </div>
                    </div>
                );

                case 4:
                    return (
                        <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                                <p className="text-white font-bold text-xl">Financial Details</p>
                                <p className="text-blue-100 text-sm">Breakdown of costs incurred due to the accident</p>
                            </div>
                
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 mb-2">
                                        <h3 className="font-medium text-gray-800 border-b pb-2">Asset & Income Losses</h3>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="assetDamage">Damage to Assets (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="assetDamage" 
                                                    value={formData.assetDamage} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                    
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="earningsLoss">Earnings Loss (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="earningsLoss" 
                                                    value={formData.earningsLoss} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-2 mt-4 mb-2">
                                        <h3 className="font-medium text-gray-800 border-b pb-2">Repair & Recovery Costs</h3>
                                    </div>
                
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="generalFixes">General Fixes (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="generalFixes" 
                                                    value={formData.generalFixes} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="specialFixes">Special Fixes (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="specialFixes" 
                                                    value={formData.specialFixes} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="usageLoss">Usage Loss (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="usageLoss" 
                                                    value={formData.usageLoss} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                    
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="loanerVehicle">Loaner Vehicle (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="loanerVehicle" 
                                                    value={formData.loanerVehicle} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className="col-span-2 mt-4 mb-2">
                                        <h3 className="font-medium text-gray-800 border-b pb-2">Travel & Medical Expenses</h3>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="tripCosts">Trip Costs (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="tripCosts" 
                                                    value={formData.tripCosts} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="journeyExpenses">Journey Expenses (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="journeyExpenses" 
                                                    value={formData.journeyExpenses} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="medications">Medications (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="medications" 
                                                    value={formData.medications} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="rehabilitation">Rehabilitation (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="rehabilitation" 
                                                    value={formData.rehabilitation} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="therapy">Therapy (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="therapy" 
                                                    value={formData.therapy} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                    
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="healthExpenses">Health Expenses (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="healthExpenses" 
                                                    value={formData.healthExpenses} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-2 mt-4 mb-2">
                                        <h3 className="font-medium text-gray-800 border-b pb-2">Additional Adjustments</h3>
                                    </div>
                
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="specialReduction">Special Reduction (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="specialReduction" 
                                                    value={formData.specialReduction} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                    
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="specialOverage">Special Overage (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="specialOverage" 
                                                    value={formData.specialOverage} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="generalRest">General Rest (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="generalRest" 
                                                    value={formData.generalRest} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                    
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="additionalInjury">Additional Injury (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="additionalInjury" 
                                                    value={formData.additionalInjury} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className="flex flex-col lg:flex-row gap-4 col-span-2 lg:gap-6">
                                        <div className="space-y-2 flex-1">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="generalUplift">General Uplift (£)</label>
                    
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">£</span>
                                                </div>
                    
                                                <input 
                                                    type="number" 
                                                    name="generalUplift" 
                                                    value={formData.generalUplift} 
                                                    onChange={handleInputChange} 
                                                    placeholder="0.00" 
                                                    min="0" 
                                                    className="w-full pl-8 p-3 bg-gray-50 border border-gray-300 rounded-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );

            case 5:
                return (
                    <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Claim Summary</p>
                            <p className="text-blue-100 text-sm">Please review your information before submission</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 w-full">
                                {Object.entries(formData).map(([key, value], index) => {
                                    const formattedKey = key
                                        .replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, str => str.toUpperCase());
                                    
                                    let header = null;
                                    if (index === 0) {
                                        header = <div className="col-span-1 lg:col-span-2 mb-2 pb-1 border-b border-gray-200 font-semibold text-gray-800">Personal Information</div>;
                                    } else if (key === 'accidentType' && index > 0) {
                                        header = <div className="col-span-1 lg:col-span-2 mt-4 mb-2 pb-1 border-b border-gray-200 font-semibold text-gray-800">Accident Information</div>;
                                    } else if (key === 'dominantInjury' && index > 0) {
                                        header = <div className="col-span-1 lg:col-span-2 mt-4 mb-2 pb-1 border-b border-gray-200 font-semibold text-gray-800">Injury Information</div>;
                                    } else if (key === 'assetDamage' && index > 0) {
                                        header = <div className="col-span-1 lg:col-span-2 mt-4 mb-2 pb-1 border-b border-gray-200 font-semibold text-gray-800">Financial Information</div>;
                                    }
                                    
                                    return (
                                        <React.Fragment key={key}>
                                            {header}
                                            <div className="py-2 px-3 rounded-lg bg-gray-50 flex justify-between items-center">
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-medium text-gray-600">{formattedKey}</span>
                                                    
                                                    {!isEditing[key] ? (
                                                        <span className="text-gray-800 font-medium">{key === "accidentDate" && value ? value.replace("T", " ") : value || "—"}</span>
                                                    ) : (
                                                        <>
                                                            {key === "gender" || key === "vehicleType" || key === "exceptional" || key === "accidentType" || 
                                                            key === "weatherConditions" || key === "policeReport" || key === "witness" || 
                                                            key === "dominantInjury" || key === "whiplash" || key === "psychological" ? (
                                                                <select 
                                                                    name={key} 
                                                                    value={formData[key as keyof typeof formData]} 
                                                                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} 
                                                                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                                >
                                                                    <option value="" disabled hidden>Select...</option>

                                                                    {key === "gender" && (
                                                                        <>
                                                                            <option value="male">Male</option>
                                                                            <option value="female">Female</option>
                                                                            <option value="other">Other</option>
                                                                        </>
                                                                    )}

                                                                    {key === "vehicleType" && (
                                                                        <>
                                                                            <option value="car">Car</option>
                                                                            <option value="motorcycle">Motorcycle</option>
                                                                            <option value="truck">Truck</option>
                                                                        </>
                                                                    )}

                                                                    {key === "exceptional" && (
                                                                        <>
                                                                            <option value="yes">Yes</option>
                                                                            <option value="no">No</option>
                                                                        </>
                                                                    )}

                                                                    {key === "accidentType" && (
                                                                        <>
                                                                            {accidentTypes.map((type, index) => (
                                                                                <option key={index} value={type}>{type}</option>
                                                                            ))}
                                                                        </>
                                                                    )}

                                                                    {key === "weatherConditions" && (
                                                                        <>
                                                                            <option value="sunny">Sunny</option>
                                                                            <option value="rainy">Rainy</option>
                                                                            <option value="snowy">Snowy</option>
                                                                        </>
                                                                    )}

                                                                    {key === "policeReport" && (
                                                                        <>
                                                                            <option value="yes">Yes</option>
                                                                            <option value="no">No</option>
                                                                        </>
                                                                    )}

                                                                    {key === "witness" && (
                                                                        <>
                                                                            <option value="yes">Yes</option>
                                                                            <option value="no">No</option>
                                                                        </>
                                                                    )}

                                                                    {key === "dominantInjury" && (
                                                                        <>
                                                                            <option value="arms">Arms</option>
                                                                            <option value="legs">Legs</option>
                                                                            <option value="hips">Hips</option>
                                                                            <option value="multiple">Multiple</option>
                                                                        </>
                                                                    )}

                                                                    {key === "whiplash" && (
                                                                        <>
                                                                            <option value="yes">Yes</option>
                                                                            <option value="no">No</option>
                                                                        </>
                                                                    )}

                                                                    {key === "psychological" && (
                                                                        <>
                                                                            <option value="yes">Yes</option>
                                                                            <option value="no">No</option>
                                                                        </>
                                                                    )}
                                                                </select>
                                                            ) : key === "accidentDate" ? (
                                                                <input 
                                                                    type="datetime-local" 
                                                                    name={key} 
                                                                    value={formData[key as keyof typeof formData]} 
                                                                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} 
                                                                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                                />
                                                            ) : key === "driverAge" || key === "vehicleAge" || key === "passengers" || key === "prognosis" || 
                                                                key === "assetDamage" || key === "earningsLoss" || key === "usageLoss" || 
                                                                key === "generalFixes" || key === "specialFixes" || key === "tripCosts" || 
                                                                key === "journeyExpenses" || key === "medications" || key === "rehabilitation" || 
                                                                key === "therapy" || key === "healthExpenses" || key === "specialReduction" || 
                                                                key === "specialOverage" || key === "generalRest" || key === "additionalInjury" || 
                                                                key === "generalUplift" || key === "loanerVehicle" ? (
                                                                <input 
                                                                    type="number" 
                                                                    name={key} 
                                                                    value={formData[key as keyof typeof formData]} 
                                                                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} 
                                                                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                                />
                                                            ) : (
                                                                <textarea 
                                                                    name={key} 
                                                                    value={formData[key as keyof typeof formData]} 
                                                                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} 
                                                                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                                    rows={2}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {!isEditing[key] ? (
                                                    <button type="button" onClick={() => setIsEditing((prev) => ({ ...prev, [key]: true }))} className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors ml-2">Edit</button>
                                                ) : (
                                                    <button type="button" onClick={() => setIsEditing((prev) => ({ ...prev, [key]: false }))} className="cursor-pointer text-green-500 hover:text-green-700 transition-colors ml-2">Save</button>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-8 text-center">
                                <p className="text-gray-600 mb-4">By submitting your claim, you agree to our <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms and Conditions</a></p>
                                
                                {submissionError && (
                                    <p className="text-red-500 mb-4">{submissionError}</p>
                                )}
                                
                                <button 
                                    type="button" 
                                    onClick={handleSubmitClaim} 
                                    disabled={isSubmitting}
                                    className={`cursor-pointer py-3 px-8 rounded-lg shadow-md transition-colors ${
                                        isSubmitting 
                                            ? "bg-gray-400 text-white cursor-not-allowed" 
                                            : "bg-green-600 hover:bg-green-700 text-white font-bold"
                                    }`}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Claim"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container-primary bg-gray-50 p-6">
            <div className="mb-8 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center mb-2">
                    {formSteps.map((step, index) => (
                        <div key={index} className={`text-xs font-medium ${index + 1 === currentForm ? 'text-blue-500' : index + 1 < currentForm ? 'text-green-500' : 'text-gray-400'}`}>{step}</div>
                    ))}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${(currentForm / formSteps.length) * 100}%` }}></div>
                </div>
            </div>
            
            <form className="flex flex-col gap-5 mb-8">
                {renderForm()}
                
                <div className="flex justify-between gap-10 mt-8 max-w-[800px] mx-auto">
                    <button 
                        type="button" 
                        onClick={prevForm} 
                        className={`py-2 px-6 rounded-lg shadow-sm transition-colors ${currentForm > 1 ? "cursor-pointer text-white bg-gray-600 hover:bg-gray-700" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`} 
                        disabled={currentForm <= 1}
                    >
                        <span className="flex items-center gap-1">Back</span>
                    </button>

                    {currentForm !== 5 && (
                        currentForm < 4 ? (
                            <button 
                                type="button" 
                                onClick={nextForm} 
                                className="cursor-pointer py-2 px-6 rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                <span className="flex items-center gap-1">Next</span>
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setcurrentForm(5)} 
                                disabled={!isFormComplete()} 
                                className={`py-2 px-6 rounded-lg shadow-sm transition-colors ${isFormComplete() ? "cursor-pointer text-white bg-green-600 hover:bg-green-700" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}
                            >
                                <span className="flex items-center gap-1">Review</span>
                            </button>
                        )
                    )}
                </div>
            </form>
        </div>
    );
};

export default SubmitClaim;