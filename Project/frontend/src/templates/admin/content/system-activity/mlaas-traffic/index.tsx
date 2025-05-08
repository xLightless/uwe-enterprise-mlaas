import React, { useEffect, useState } from "react";
import { createdModelPrediction, getModels } from "../../../../../repositories/models";
import { ModelFeatures, ModelFeaturesPredicted, ModelProps } from "../../../../../common/interfaces";
import { Scrollbar } from "../../../../../components/scrollbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LIMEPrediction from "./components/chart/prediction";

interface ModelsProps {
    models: ModelProps[];
    clickedModel?: ModelProps | null;
    setClickedModel(model: ModelProps): void;
}

interface PredictionCardProps {
    metricType: string;
    metricValue: string;
    width?: string;
    height?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ metricType, metricValue, width, height }) => {
    return (
        <div className={`flex flex-col justify-center items-center rounded-lg shadow-md ${width ? `${`w-` + width}` : `w-full`} ${height ? `${`h-` + height}` : `w-full`} bg-gray-500 ml-4 mr-4 p-4`}>
            <h2 className="text-lg font-bold text-gray-700">{metricType}</h2>
            <p className="text-xl font-semibold text-gray-900">{metricValue}</p>
        </div>
    )
};

const Models: React.FC<ModelsProps> = ({ models, setClickedModel, clickedModel }) => {
    // console.log("Models:", models);
    const [mlModels, ] = useState<ModelProps[]>(models.map((model: ModelProps) => {
        console.log("Model:", model);
        return {
            modelName: model.model_name,
            modelDescription: model.model_description,
            modelVersion: model.model_version,
            modelFile: model.model_file,
            uploadedAt: model.uploaded_at,
            isActive: model.is_active,
        } as ModelProps;
    }));

    // const [clickedModel, setClickedModel] = useState<ModelProps | null>(null);

    /**
     * Changes the model present in the user interface for user interactivity.
     * @param model - The model to be clicked.
     */
    const onModelClick = (model: ModelProps) => {
        const clickedModel = {
            modelName: model.modelName,
            modelDescription: model.modelDescription,
            modelVersion: model.modelVersion,
            modelFile: model.modelFile,
            uploadedAt: model.uploadedAt,
            isActive: model.isActive,
        } as ModelProps

        setClickedModel(clickedModel);
    };


    /**
     * Activates the current model clicked by the user.
     * @param model - The model to be activated.
     */
    const setActiveModel = (model: ModelProps) => {
        console.log("Model activated:", model);
    };

    return (
        <ul className="w-full h-full">
            {mlModels.map((model, index) => (
                <li
                    key={index}
                    className={`flex flex-row justify-between hover:bg-gray-300 cursor-pointer ${clickedModel?.modelName === model.modelName ? "bg-gray-300" : ""}`}
                    onClick={() => onModelClick(model)}
                >
                    <h1 className="font-bold typography text-left">{model.modelName}</h1>

                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-green-500 cursor-pointer"
                            onClick={() => setActiveModel(model)}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
};

const MLAASTraffic: React.FC = () => {

    // ML Models
    const [mlModels, setMLModels] = useState<ModelProps[] | null>(null);
    const [clickedModel, setClickedModel] = useState<ModelProps | null>(null);

    const [predictionFeatures, setPredictionFeatures] = useState<ModelFeatures>({
        gender: "Male",
        driverAge: "33",
        vehicleType: "Motorcycle",
        vehicleAge: "13",
        passengers: "4",
        exceptional: "No",
        accidentType: "Rear end",
        accidentDate: "22:24.5",
        weatherConditions: "Rainy",
        policeReport: "Yes",
        witness: "Yes",
        accidentDescription: "Side collision at an intersection.",
        dominantInjury: "Arms",
        prognosis: "E. 5 months",
        whiplash: "Yes",
        psychological: "Yes",
        injuryDescription: "Whiplash and minor bruises.",
        assetDamage: "0",
        earningsLoss: "0",
        usageLoss: "0",
        generalFixes: "0",
        specialFixes: "0",
        tripCosts: "0",
        journeyExpenses: "0",
        medications: "0",
        rehabilitation: "0",
        therapy: "0",
        healthExpenses: "0",
        specialReduction: "0",
        specialOverage: "0",
        generalRest: "0",
        additionalInjury: "0",
        generalUplift: "520",
        loanerVehicle: "0"
    });

    /**
     * Predicted features returned by the model.
     * This is the response from the backend after a prediction is made.
     */
    const [modelPrediction, setModelPrediction] = useState<ModelFeaturesPredicted | null>({
        gender: 0,
        driverAge: 0.23,
        vehicleAge: 0.74,
        vehicleType: 0,
        passengers: 0,
        exceptional: -1,
        accidentType: 11,
        accidentDate: 0,
        weatherConditions: 0,
        policeReport: 0,
        witness: 0,
        accidentDescription: 0,
        dominantInjury: 0,
        prognosis: 0.69,
        whiplash: 0,
        psychological: 0,
        injuryDescription: -1,
        assetDamage: -1,
        earningsLoss: -1,
        usageLoss: 0,
        generalFixes: 0,
        specialFixes: 0,
        tripCosts: 0,
        journeyExpenses: 0,
        medications: -1,
        rehabilitation: 0,
        therapy: -1,
        healthExpenses: -1,
        specialReduction: 0,
        specialOverage: 0,
        generalRest: 0,
        additionalInjury: 0,
        generalUplift: 0,
        loanerVehicle: 0
    });


    async function fetchModels() {
        const models = await getModels();
        console.log("Models:", models);
        setMLModels(models.data as ModelProps[]);
        console.log("ML Models:", models.data);
    }

    /**
     * Creates a request to the backend to create a
     * prediction based on the features and model selected.
     *
     * @param features - The features to be used for prediction.
     * @param model - The model to be used for prediction.
     * @returns {Promise<void>} - A promise that resolves when the prediction is created.
     */
    async function createPrediction(
        features: ModelFeatures,
        model: ModelProps
    ): Promise<void> {
        if (!model || !model.modelId) return;
        const prediction = await createdModelPrediction(model.modelId, features)
        setModelPrediction(prediction.data as ModelFeaturesPredicted);
    };


    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
    // const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});

    const toggleEdit = (key: string) => {
        setIsEditing((prev) => ({ ...prev, [key]: !prev[key] }));
        // if (isEditing[key]) {
        //     const typeKey = key as keyof ModelFeatures;
        // }
    };

    const handleValueChange = (key: string, newValue: string) => {
        // setEditedValues((prev) => ({ ...prev, [key]: newValue }));
        setPredictionFeatures((prev) => ({ ...prev, [key]: newValue }));
    };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <>
            <div className="w-full h-full grid grid-rows-2 gap-4">
                <div className="w-full h-full grid grid-cols-[325px_1fr] gap-x-4">
                    {/* Selected Model Information */}
                    <div className="bg-gray-200 rounded shadow-md">
                        <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                            <div className="px-4">
                                <h1 className="font-bold typography text-left">System ML Models</h1>
                            </div>
                        </div>

                        {/* List of established roles */}
                        <div className={`w-full flex flex-col ${!mlModels ? "h-[calc(100%-45px)]" : "py-4"}`}>
                            {mlModels &&
                                <Scrollbar paddingLeft="4">
                                        <Models models={mlModels} setClickedModel={setClickedModel} clickedModel={clickedModel} />
                                </Scrollbar>
                            }

                            {!mlModels &&
                                <div className="w-full h-full flex justify-center items-center">
                                    <p className="typography font-bold">No models found.</p>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Analytics */}
                    <div className="bg-gray-200 rounded shadow-md">
                        <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                            <div className="px-4">
                                <h1 className="font-bold typography text-left">Model Analysis {clickedModel?.modelName}</h1>
                            </div>
                        </div>

                        {mlModels &&
                            <div className={`grid grid-rows-[1fr_auto] ${mlModels ? "h-[calc(100%-45px)]" : "py-4"}`}>
                                {/* CHART */}
                                <div className="">
                                    <Scrollbar paddingLeft="4">
                                        <div className="max-h-96">
                                            <LIMEPrediction data={modelPrediction as ModelFeaturesPredicted} />
                                        </div>
                                    </Scrollbar>
                                </div>

                                {/* Prediction Metrics of a Model */}
                                <div className="flex flex-row justify-center items-center px-4 py-2">
                                    <PredictionCard metricType="MSE" metricValue="23%" />
                                    <PredictionCard metricType="RMSE" metricValue="23%" />
                                    <PredictionCard metricType="R2" metricValue="23%" />
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className="w-full h-full grid grid-cols-[325px_1fr] gap-x-4">
                    {/* Selected Model Information */}
                    <div className="w-full h-full bg-gray-200 rounded shadow-md">
                        <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                            <div className="px-4">
                                <h1 className="font-bold typography text-left">Selected Model Information</h1>
                            </div>
                        </div>

                        {!clickedModel &&
                            <div className="w-full h-full flex justify-center items-center">
                                <p className="typography font-bold">No model selected.</p>
                            </div>
                        }

                        {clickedModel && (
                            <div className="grid grid-rows-[0.6fr_0.4fr] h-[calc(100%-45px)] shadow-md rounded-lg overflow-hidden">
                                {/* Model Information */}
                                <div className="flex flex-col gap-y-4 px-6 py-4 border-b border-gray-300 text-left">
                                    <div className="flex flex-col gap-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800">Name:</span> {clickedModel.modelName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800">Description:</span> {clickedModel.modelDescription}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800">Version:</span> {clickedModel.modelVersion}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800">Uploaded At:</span> {clickedModel.uploadedAt}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800">Active:</span>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-white ${clickedModel.isActive ? "bg-green-500" : "bg-red-500"}`}>
                                                {clickedModel.isActive ? "True" : "False"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Model File */}
                                <div className="flex flex-col gap-y-4 px-6 py-4">
                                    <h2 className="text-lg font-bold text-gray-700">Model File</h2>
                                    <a
                                        href={clickedModel.modelFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline hover:text-blue-700"
                                    >
                                        {clickedModel.modelFile}
                                    </a>
                                </div>
                            </div>
                        )}

                    </div>


                    {/* Model Parameters and Predictions */}
                    <div className="bg-gray-200 rounded shadow-md">
                        <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                            <div className="px-4">
                                <h1 className="font-bold typography text-left">Model Parameters and Prediction Testing</h1>
                            </div>

                            {/* Prediction Metrics */}
                            <div className="px-4">
                                <ul className="flex flex-row space-x-4">
                                    <li className="font-bold">MSE: 23%</li>
                                    <li className="font-bold">RMSE: 23%</li>
                                    <li className="font-bold">R2: 23%</li>
                                </ul>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 ${mlModels ? "h-[calc(100%-45px)]" : "py-4"}`}>
                            {clickedModel &&
                                <>
                                    <Scrollbar>
                                        <div className="max-h-96">
                                            <table className="table-auto w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                                                        <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
                                                        <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {predictionFeatures &&
                                                        Object.entries(predictionFeatures).map(([key, value]) => {
                                                            const typedKey = key as keyof ModelFeatures;
                                                            const formattedKey = key
                                                                .replace(/([a-z])([A-Z])/g, "$1 $2")
                                                                .replace(/^\w/, (c) => c.toUpperCase());
                                                            return (
                                                                <tr key={key} className="border-b border-gray-300">
                                                                    <td className="border border-gray-300 px-4 py-2 text-sm text-left">
                                                                        {formattedKey}
                                                                    </td>
                                                                    <td className="border border-gray-300 px-4 py-2 text-sm text-left">
                                                                        {isEditing[key] ? (
                                                                            <input
                                                                                value={predictionFeatures[typedKey] || value}
                                                                                onChange={(e) =>
                                                                                    handleValueChange(key, e.target.value)
                                                                                }
                                                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                                            />
                                                                        ) : (
                                                                            value
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-300 px-4 py-2 text-sm cursor-pointer">
                                                                        <span
                                                                            className={`${
                                                                                isEditing[key]
                                                                                    ? "text-red-500"
                                                                                    : "text-blue-500"
                                                                            }`}
                                                                            onClick={() => toggleEdit(key)}
                                                                        >
                                                                            {isEditing[key] ? "Save" : "Edit"}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Scrollbar>


                                    <div className="mt-4">
                                        <button
                                            className="bg-red-500 rounded-md p-2 text-white"
                                            onClick={() => createPrediction(predictionFeatures, clickedModel)}
                                        >Test Prediction</button>
                                    </div>
                                </>
                            }

                            {!clickedModel &&
                                <div className="w-full h-full flex justify-center items-center">
                                    <p className="typography font-bold">Select a model to train a prediction...</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default MLAASTraffic;