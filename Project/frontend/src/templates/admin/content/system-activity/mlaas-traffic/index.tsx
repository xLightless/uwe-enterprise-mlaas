import React, { useState } from "react";
import { getModels } from "../../../../../repositories/models";
import { updateUserDetails } from "../../../../../repositories/user";
import { loginUser } from "../../../../../repositories/auth";

// CREATE TABLE public."ModelUsageLogs" (
//     usage_id integer NOT NULL,
//     user_id integer NOT NULL,
//     model_id integer NOT NULL,
//     num_predictions integer NOT NULL,
//     model_duration interval NOT NULL,
//     created_at timestamp without time zone NOT NULL
// );

// Swap models on demand
//


const MLAASTraffic: React.FC = () => {
    const [data, setData] = useState<any>(null);

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
            <p className="text-lg text-blue-500">{data}</p>
        </div>
        </>
    )
};

export default MLAASTraffic;