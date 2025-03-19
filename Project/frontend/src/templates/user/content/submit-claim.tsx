import React from 'react';

const SubmitClaim: React.FC = () => {
    return (
        <div className="container-primary">
            <form className="flex flex-col gap-5 p-5">
                <p className="text-2xl font-bold p-2 rounded-md text-white bg-gray-500">Submit New Claim</p>

                <div className="flex flex-col lg:flex-row justify-center gap-10 mb-5">
                    <div className="flex flex-col gap-5 w-full">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Basic Details</p>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="gender">Driver Gender</label>
                            <select name="gender" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="driverAge">Driver Age</label>
                            <input type="number" name="driverAge" placeholder="Driver Age..." min="18" max="99" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="vehicleType">Vehicle Type</label>
                            <select name="vehicleType" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="car">Car</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="truck">Truck</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="vehicleAge">Vehicle Age</label>
                            <input type="number" name="vehicleAge" placeholder="Vehicle Age..." min="0" max="99" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="passengers">Number of Passengers</label>
                            <input type="number" name="passengers" placeholder="Number of Passengers..." min="0" max="99" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="exceptional">Exceptional Circumstances</label>
                            <select name="exceptional" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Accident Details</p>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="accidentType">Accident Type</label>
                            <input type="text" name="accidentType" placeholder="Accident Type..." className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="accidentDate">Accident Date</label>
                            <input type="datetime-local" name="accidentDate" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="weatherConditions">Weather Conditions</label>
                            <select name="weatherConditions" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="sunny">Sunny</option>
                                <option value="rainy">Rainy</option>
                                <option value="snowy">Snowy</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="policeReport">Police Report Filed</label>
                            <select name="policeReport" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="witness">Witness Present</label>
                            <select name="witness" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="accidentDescription">Accident Description</label>
                            <textarea name="accidentDescription" placeholder="Enter Accident Description..." className="p-2 rounded-md border"/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                        <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Injury Details</p>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="dominantInjury">Dominant Injury</label>
                            <select name="dominantInjury" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="arms">Arms</option>
                                <option value="legs">Legs</option>
                                <option value="hips">Hips</option>
                                <option value="multiple">Multiple</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="prognosis">Injury Prognosis</label>
                            <input type="number" name="prognosis" placeholder="Infury Prognosis in Months..." min="0" max="100" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="whiplash">Whiplash</label>
                            <select name="whiplash" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="psychological">Minor Psychological Injury</label>
                            <select name="psychological" className="p-2 rounded-md border">
                                <option value="" selected disabled hidden>Select...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="injuryDescription">Injury Description</label>
                            <textarea name="injuryDescription" placeholder="Enter Injury Description..." className="p-2 rounded-md border"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-5 mb-5">
                    <p className="p-2 rounded-md font-bold text-xl bg-slate-200">Costs</p>

                    <div className="flex flex-col lg:flex-row gap-5 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="assetDamage">Damage to Assets</label>
                            <input type="number" name="assetDamage" placeholder="Damage to Assets..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="earningsLoss">Earnings Loss</label>
                            <input type="number" name="earningsLoss" placeholder="Earnings Loss..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="usageLoss">Usage Loss</label>
                            <input type="number" name="usageLoss" placeholder="Usage Loss..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="generalFixes">Cost of General Fixes</label>
                            <input type="number" name="generalFixes" placeholder="Cost of General Fixes..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="specialFixes">Special Fixes</label>
                            <input type="number" name="specialFixes" placeholder="Cost of Special Fixes..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="tripCosts">Trip Costs</label>
                            <input type="number" name="tripCosts" placeholder="Trip Costs..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="journeyExpenses">Journey Expenses</label>
                            <input type="number" name="journeyExpenses" placeholder="Journey Expenses..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="medications">Cost of Medications</label>
                            <input type="number" name="medications" placeholder="Cost of Medications..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="rehabilitation">Cost of Rehabilitation</label>
                            <input type="number" name="rehabilitation" placeholder="Cost of Rehabilitation..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold" htmlFor="therapy">Cost of Therapy</label>
                            <input type="number" name="therapy" placeholder="Cost of Therapy..." min="0" max="999999" className="p-2 rounded-md border"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 mb-20">
                    <p className="text-sm">By submitting a claim, you agree to our <a href="#" className="text-blue-500">Terms and Conditions.</a></p>
                    <button type="submit" className="cursor-pointer py-2 px-4 max-w-[150px] place-self-center rounded-md font-bold text-2xl text-white bg-blue-500 hover:bg-blue-400">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default SubmitClaim;