import React, { useState } from 'react';

const UploadCSV: React.FC = () => {
    const [fileName, setFileName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            alert("CSV file submitted successfully!");
            setIsSubmitting(false);
            setFileName("");
        }, 1500);
    };

    return (
        <div className="container-primary bg-gray-50 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-8">
                <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                        <p className="text-white font-bold text-xl">Claim File Upload</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                                <input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                                
                                <label htmlFor="csvFile" className="cursor-pointer flex flex-col items-center justify-center">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-white"></div>
                                    </div>
                                    
                                    <span className="text-blue-500 font-medium mb-1">{fileName ? fileName : "Click to select a file"}</span>
                                    
                                    <span className="text-xs text-gray-500">File must be in CSV format</span>
                                </label>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Please make sure that every field is filled out in the CSV claim file</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full max-w-[800px] mx-auto mt-6">
                    <div className="text-center border-t border-gray-200 pt-4">
                        <p className="text-gray-600 mb-4 text-sm">By submitting your claim data, you agree to our <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms and Conditions</a></p>
                        
                        <button 
                            type="submit"
                            disabled={!fileName || isSubmitting} 
                            className={`py-3 px-8 rounded-lg shadow-md transition-colors ${fileName && !isSubmitting ? "cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">Processing...</span>
                            ) : (
                                "Submit Claim Data"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadCSV;