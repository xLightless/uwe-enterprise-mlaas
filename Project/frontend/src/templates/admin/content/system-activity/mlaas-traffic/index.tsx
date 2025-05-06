import React, { useState } from "react";
import { getModels } from "../../../../../repositories/models";
import { JSONResponse } from "../../../../../common/interfaces";

const MLAASTraffic: React.FC = () => {
    const [data, setData] = useState<JSONResponse | null>(null);

    async function fetchModels() {
        const models = await getModels();
        console.log(models);
        setData(models);
    }

    return (
        <>
        <div className="w-full h-52">
            <button
                className="p-4 h-fit w-fit btn bg-blue-500 text-white rounded-md hover:bg-blue-400 cursor-pointer"
                onClick={fetchModels}
            >
                Swap Models
            </button>
            <p className="text-lg text-blue-500">{JSON.stringify(data)}</p>
        </div>
        </>
    )
};

export default MLAASTraffic;