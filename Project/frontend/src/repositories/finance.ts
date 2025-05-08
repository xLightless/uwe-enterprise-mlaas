import axios from "axios";
import { JSONResponse } from "../common/interfaces";
import { getTokenAccess } from "../common/session";


const finance = axios.create({
    baseURL: 'http://localhost:8000/api/finance',
})

finance.interceptors.request.use(
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


/**
 * Initialises a payment of an approved claim from the claims department.
 * @param claimId - The ID of the claim to be paid.
 * @returns {Promise<JSONResponse>} - The response from the server.
 */
const initialisePayment = async (claimId: number): Promise<JSONResponse> => {
    return finance.get<JSONResponse>(`/initiate-payment/${claimId}/`, {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching claims by status:', error);
            throw error;
        });
};

/**
 * Fetches all the active claims to settle from approved state.
 * @returns {Promise<JSONResponse>} - The response from the server.
 */
const getApprovedClaimsToSettle = async (): Promise<JSONResponse> => {
    return finance.get<JSONResponse>('/claims-to-settle/', {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching claims by status:', error);
            throw error;
        });
};


export {
    initialisePayment,
    getApprovedClaimsToSettle
}