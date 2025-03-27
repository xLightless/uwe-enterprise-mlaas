import React from 'react';

const UploadCSV: React.FC = () => {
    return (
        <div className="container-primary p-5">
            <p className="text-2xl font-bold p-2 rounded-md text-white bg-gray-500">Upload CSV</p>

            <form className="flex flex-col gap-5 p-5">
                <div className="flex flex-col mb-4">
                    <label className="font-bold mb-2" htmlFor="csvFile">Upload CSV File</label>
                    <input id="csvFile" type="file" accept=".csv" className="cursor-pointer p-3 max-w-[300px] rounded-md shadow-sm border place-self-center file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100"/>
                </div>

                <div className="flex flex-col gap-5">
                    <p className="text-sm">By submitting a claim, you agree to our <a href="#" className="text-blue-500">Terms and Conditions.</a></p>
                    <button type="submit" className="cursor-pointer py-2 px-4 max-w-[150px] place-self-center rounded-md font-bold text-2xl text-white bg-green-500 hover:bg-green-400">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default UploadCSV;