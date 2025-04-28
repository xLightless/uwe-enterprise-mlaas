import axios from 'axios';
import { JSONResponse, TableData } from '../common/interfaces';

const traffic = axios.create({
    baseURL: 'http://localhost:8000/api/logs'
});

const getActivityLogsNext = async (startIndex: number, endIndex: number): Promise<JSONResponse> => {
    return traffic.get<JSONResponse>(`/activity/${startIndex}/${endIndex}/`)
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