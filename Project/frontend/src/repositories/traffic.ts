import axios from 'axios';
import { JSONResponse } from '../common/interfaces';

const traffic = axios.create({
    baseURL: 'http://localhost:8000/api/logs'
});

const getRecentActivityLogs = async (): Promise<JSONResponse> => {
    return traffic.get<JSONResponse>('/activity/')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching recent activity logs:', error);
            throw error;
        });
}



export {
    getRecentActivityLogs
}