import axios from 'axios';
import { JSONResponse, ModelProps, ModelStatistics } from '../common/interfaces';


const models = axios.create({
    baseURL: 'http://localhost:8000/api/models'
});

const authModels = axios.create({
    baseURL: 'http://localhost:8000/api/auth/models',
});

/**
 * Retrieves a list of models from the server.
 * @async
 * @function getModels
 * @throws Will throw an error if the request fails.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the list of models.
 */
const getModels = async (): Promise<JSONResponse> => {
    return models.get<JSONResponse>('/view/')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching models:', error);
            throw error;
        });
};

/**
 * Creates a new model to the server.
 * @async
 * @function createModel
 * @param {ModelProps} modelProps - The properties of the model to be created.
 * @throws Will throw an error if the request fails.
 * @returns {Promise<void>} - A promise that resolves to the created model.
 */
const createModel = async (modelProps: ModelProps): Promise<void> => {
    authModels.post<JSONResponse<ModelProps>>('/add_models/', modelProps)
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating model:', error);
            throw error;
        });
};

/**
 * Deletes a model from the server.
 * @async
 * @function deleteModel
 * @param {number} modelId - The ID of the model to be deleted.
 * @throws Will throw an error if the request fails.
 * @returns {Promise<void>} - A promise that resolves to the response of the deletion.
 */
const deleteModel = async (modelId: number): Promise<void> => {
    return authModels.delete(`/${modelId}/delete/`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error deleting model:', error);
            throw error;
    });
};

/**
 *
 * @param modelId - The ID of the model to be set as active.
 * @async
 * @function setActiveModel
 * @throws Will throw an error if the request fails.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the response of the activation.
 */
const setActiveModel = async (modelId: number): Promise<JSONResponse> => {
    return models.post(`/${modelId}/set_active/`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error setting active model:', error);
            throw error;
    });
};

/**
 *
 * @param modelId - The ID of the model to get statistics for.
 * @async
 * @function getModelStatistics
 * @throws Will throw an error if the request fails.
 * @returns {Promise<JSONResponse<ModelStatistics>>} - A promise that resolves to the model statistics.
 */
const getModelStatistics = async (modelId: number): Promise<JSONResponse<ModelStatistics>> => {
    return models.get<JSONResponse<ModelStatistics>>(`/${modelId}/statistics/`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching model statistics:', error);
            throw error;
    });
};

/**
 * Retrieves all feedback for a given model ID.
 * @async
 * @function getModelFeedback - Retrieves feedback for a specific model.
 * @param {number} modelId - The ID of the model to get feedback for.
 * @throws Will throw an error if the request fails.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the feedback data.
 */
const getModelFeedback = async (modelId: number): Promise<JSONResponse> => {
    return models.get<JSONResponse>(`/${modelId}/feedback/`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching model feedback:', error);
            throw error;
    });
};

export {
    getModels,
    createModel,
    deleteModel,
    setActiveModel,
    getModelStatistics,
    getModelFeedback
}