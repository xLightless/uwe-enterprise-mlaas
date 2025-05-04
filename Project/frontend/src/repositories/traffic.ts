import axios from 'axios';
import { JSONResponse } from '../common/interfaces';
import { getTokenAccess } from '../common/session';

const traffic = axios.create({
    baseURL: 'http://localhost:8000/api/logs'
});

traffic.interceptors.request.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/';
        }
    }
);

const getActivityLogsNext = async (startIndex: number, endIndex: number): Promise<JSONResponse> => {
    return traffic.get<JSONResponse>(`/activity/${startIndex}/${endIndex}/`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Error fetching activity logs:", error);
            throw error;
        });
};

/**
 * Retrieves an aggregated count of the past 3 months of connections.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the past connections data.
 */
const getPastConnections = async (): Promise<JSONResponse> => {
    return traffic.get<JSONResponse>(`/activity/chart/`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Error fetching past connections:", error);
            throw error;
        });
};


export {
    getActivityLogsNext,
    getPastConnections
}