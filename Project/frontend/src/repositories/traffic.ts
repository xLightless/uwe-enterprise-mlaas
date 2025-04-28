import axios from 'axios';
import { JSONResponse } from '../common/interfaces';
import { getTokenAccess } from '../common/session';

const traffic = axios.create({
    baseURL: 'http://localhost:8000/api/logs'
});

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


export {
    getActivityLogsNext
}