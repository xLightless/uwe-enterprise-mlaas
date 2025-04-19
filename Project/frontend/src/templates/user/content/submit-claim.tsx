import React, { useState } from "react";

const SubmitClaim: React.FC = () => {
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
    });
    
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

    const renderForm = () => {
        switch (currentForm) {
            case 1:
                return (
                    <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Basic Details</p>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="gender">Driver Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="driverAge">Driver Age</label>
                            <input type="number" name="driverAge" value={formData.driverAge} onChange={handleInputChange} placeholder="Driver Age..." min="18" max="99" className="p-2 rounded-md border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="vehicleType">Vehicle Type</label>
                            <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="car">Car</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="truck">Truck</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="vehicleAge">Vehicle Age</label>
                            <input type="number" name="vehicleAge" value={formData.vehicleAge} onChange={handleInputChange} placeholder="Vehicle Age..." min="0" max="99" className="p-2 rounded-md border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="passengers">Number of Passengers</label>
                            <input type="number" name="passengers" value={formData.passengers} onChange={handleInputChange} placeholder="Number of Passengers..." min="0" max="99" className="p-2 rounded-md border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="exceptional">Exceptional Circumstances</label>
                            <select name="exceptional" value={formData.exceptional} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Accident Details</p>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="accidentType">Accident Type</label>
                            <input type="text" name="accidentType" value={formData.accidentType} onChange={handleInputChange} placeholder="Accident Type..." className="p-2 rounded-md border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="accidentDate">Accident Date</label>
                            <input type="datetime-local" name="accidentDate" value={formData.accidentDate} onChange={handleInputChange} className="p-2 rounded-md border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="weatherConditions">Weather Conditions</label>
                            <select name="weatherConditions" value={formData.weatherConditions} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="sunny">Sunny</option>
                                <option value="rainy">Rainy</option>
                                <option value="snowy">Snowy</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="policeReport">Police Report Filed</label>
                            <select name="policeReport" value={formData.policeReport} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="witness">Witness Present</label>
                            <select name="witness" value={formData.witness} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="accidentDescription">Accident Description</label>
                            <textarea name="accidentDescription" value={formData.accidentDescription} onChange={handleInputChange} placeholder="Enter Accident Description..." className="p-2 rounded-md border" />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Injury Details</p>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="dominantInjury">Dominant Injury</label>
                            <select name="dominantInjury" value={formData.dominantInjury} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="arms">Arms</option>
                                <option value="legs">Legs</option>
                                <option value="hips">Hips</option>
                                <option value="multiple">Multiple</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="prognosis">Injury Prognosis</label>
                            <input type="number" name="prognosis" value={formData.prognosis} onChange={handleInputChange} placeholder="Injury Prognosis in Months..." min="0" max="100" className="p-2 rounded-md border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="whiplash">Whiplash</label>
                            <select name="whiplash" value={formData.whiplash} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="psychological">Minor Psychological Injury</label>
                            <select name="psychological" value={formData.psychological} onChange={handleInputChange} className="p-2 rounded-md border">
                                <option value="" disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold" htmlFor="injuryDescription">Injury Description</label>
                            <textarea name="injuryDescription" value={formData.injuryDescription} onChange={handleInputChange} placeholder="Enter Injury Description..." className="p-2 rounded-md border" />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Costs</p>

                        <div className="flex flex-row justify-center gap-5">
                            <div className="flex flex-col gap-5 w-full">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="assetDamage">Damage to Assets</label>
                                    <input type="number" name="assetDamage" value={formData.assetDamage} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="earningsLoss">Earnings Loss</label>
                                    <input type="number" name="earningsLoss" value={formData.earningsLoss} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="usageLoss">Usage Loss</label>
                                    <input type="number" name="usageLoss" value={formData.usageLoss} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="generalFixes">Cost of General Fixes</label>
                                    <input type="number" name="generalFixes" value={formData.generalFixes} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="specialFixes">Special Fixes</label>
                                    <input type="number" name="specialFixes" value={formData.specialFixes} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-5 w-full">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="tripCosts">Trip Costs</label>
                                    <input type="number" name="tripCosts" value={formData.tripCosts} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="journeyExpenses">Journey Expenses</label>
                                    <input type="number" name="journeyExpenses" value={formData.journeyExpenses} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="medications">Cost of Medications</label>
                                    <input type="number" name="medications" value={formData.medications} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="rehabilitation">Cost of Rehabilitation</label>
                                    <input type="number" name="rehabilitation" value={formData.rehabilitation} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-bold" htmlFor="therapy">Cost of Therapy</label>
                                    <input type="number" name="therapy" value={formData.therapy} onChange={handleInputChange} placeholder="Enter Cost..." min="0" max="999999" className="p-2 rounded-md border" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="flex flex-col gap-5 w-full max-w-[800px] mx-auto">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Summary</p>

                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                                <div className="flex flex-row gap-2 items-center">
                                    <span className="font-bold text-wrap">{key}: </span>

                                    {!isEditing[key] ? (
                                        <span>{value}</span>
                                    ) : (
                                        <>
                                            {key === "gender" || key === "vehicleType" || key === "exceptional" || key === "weatherConditions" || key === "policeReport" || key === "witness" || key === "dominantInjury" || key === "whiplash" || key === "psychological" ? (
                                                <select name={key} value={formData[key as keyof typeof formData]} onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} className="p-2 rounded-md border">
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
                                            ) : key === "driverAge" || key === "vehicleAge" || key === "passengers" || key === "prognosis" || key === "assetDamage" || key === "earningsLoss" || key === "usageLoss" || key === "generalFixes" || key === "specialFixes" || key === "tripCosts" || key === "journeyExpenses" || key === "medications" || key === "rehabilitation" || key === "therapy" ? (
                                                <input type="number" name={key} value={formData[key as keyof typeof formData]} onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} className="p-2 rounded-md border"/>
                                            ) : (
                                                <textarea name={key} value={formData[key as keyof typeof formData]} onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value, }))} className="p-2 rounded-md border"/>
                                            )}
                                        </>
                                    )}
                                </div>

                                {!isEditing[key] ? (
                                    <button type="button" onClick={() => setIsEditing((prev) => ({ ...prev, [key]: true, }))} className="cursor-pointer text-blue-500">Edit</button>
                                ) : (
                                    <button type="button" onClick={() => setIsEditing((prev) => ({ ...prev, [key]: false, }))} className="cursor-pointer text-green-500">Save</button>
                                )}
                            </div>
                        ))}

                        <p className="mt-5">By submitting your claim, you agree to our <a href="#" className="text-blue-500">Terms and Conditions.</a></p>
                        <button type="button" className="cursor-pointer place-self-center py-2 px-4 rounded-md font-bold text-xl text-white bg-green-500 hover:bg-green-400">Submit</button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container-primary">
            <form className="flex flex-col gap-5 p-5">
                {renderForm()}
                
                <div className="flex justify-between mt-5">
                    <button type="button" onClick={prevForm} className={`py-2 px-4 rounded-md ${currentForm > 1 ? "cursor-pointer text-white bg-gray-500 hover:bg-gray-400" : "text-gray-400 bg-gray-300 cursor-not-allowed"}`} disabled={currentForm <= 1}>Back</button>

                    {currentForm < 4 ? (
                        <button type="button" onClick={nextForm} className="cursor-pointer py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-400">Next</button>
                    ) : (
                        <button type="button" onClick={() => setcurrentForm(5)} disabled={!isFormComplete()} className={`py-2 px-4 rounded-md ${isFormComplete() ? "cursor-pointer text-white bg-green-500 hover:bg-green-400" : "text-gray-400 bg-gray-300 cursor-not-allowed"}`}>Review</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SubmitClaim;