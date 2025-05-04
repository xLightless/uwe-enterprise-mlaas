import React, { useEffect, useState } from "react";
import { getModels } from "../../../../../repositories/models";
import { ModelProps } from "../../../../../common/interfaces";

const MLAASTraffic: React.FC = () => {

    // Collection of multiple ML Models
    const [mlModels, setMLModels] = useState<ModelProps[]>([]);

    // Single ML Model Properties and Statistics
    // const [modelProperties, setModelProperties] = useState<ModelProps | null>(null);
    // const [modelStats, setModelStats] = useState<ModelStatistics | null>(null);

    async function fetchModels() {
        const models = await getModels();
        setMLModels(models.data as ModelProps[]);
    }

    // async function fetchModelProperties() {
    //     const fetchedModelProperties = await getModels();
    // };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <>
            <div>
                <ul>
                    {mlModels.map((model, index) => (
                        <li key={index}>{JSON.stringify(model)}</li>
                    ))}
                </ul>
            </div>
        </>
    )
};

export default MLAASTraffic;