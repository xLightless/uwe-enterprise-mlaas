import axios from "axios";
import { AdminExportClaims, AdminSearchClaims, JSONResponse, mapToClaimData, ModelFeatures } from "../common/interfaces";
import { getTokenAccess } from "../common/session";


const claims = axios.create({
    baseURL: 'http://localhost:8000/api/claims',
})

const adminClaims = axios.create({
    baseURL: 'http://localhost:8000/api/admin/claims',
})

const financeClaims = axios.create({
    baseURL: 'http://localhost:8000/api/finance/claims',
})

claims.interceptors.request.use(
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

adminClaims.interceptors.request.use(
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

financeClaims.interceptors.request.use(
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
 *
 * ADMIN FUNCTIONS
 *
 */

const adminGetClaimsByStatus = async (status: string): Promise<JSONResponse> => {
    return adminClaims.get<JSONResponse<ModelFeatures>>(`/${status}/`, {
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

const adminUpdateClaim = async (claimId: number, status: string): Promise<JSONResponse> => {
    return adminClaims.patch<JSONResponse<ModelFeatures>>(`/${claimId}/update/`, { status }, {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating claim:', error);
            throw error;
        });
};

/**
 * Retrieve claim details by ID.
 * @param claimId - The ID of the claim to retrieve details for.
 * @returns
 */
const adminGetClaimDetails = async (claimId: number): Promise<JSONResponse> => {
    return adminClaims.get<JSONResponse<Record<string, unknown>>>(`/${claimId}/details/`, {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching claim by ID:', error);
            throw error;
        });
}

const adminBulkUpdateClaims = async (claimIds: number[], status: string): Promise<JSONResponse> => {
    return adminClaims.post<JSONResponse>('/bulk-update/', {
        "claim_ids": claimIds,
        "status": status
    }, {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error bulk updating claims:', error);
            throw error;
        });
}

const adminSearchClaims = async (searchTerm: AdminSearchClaims): Promise<JSONResponse> => {
    return adminClaims.get<JSONResponse>('/search/', {
        params: {
            "user_name": searchTerm.userName,
            "user_email": searchTerm.userEmail,
            "claim_id": searchTerm.claimId,
            "accident_type": searchTerm.accidentType,
            "status": searchTerm.status,
            "min_settlement": searchTerm.minSettlement,
            "max_settlement": searchTerm.maxSettlement,
            "min_date": searchTerm.startDate,
            "max_date": searchTerm.endDate,
            "injury_type": searchTerm.injuryType,
        },
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error searching claims:', error);
        throw error;
    });
};

const adminExportClaims = async (status: AdminExportClaims): Promise<JSONResponse> => {
    return adminClaims.get<JSONResponse<AdminExportClaims>>('/export/', {
        params: {
            "status": status.statusFilter,
            "start_date": status.startDate,
            "end_date": status.endDate
        },
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error exporting claims:', error);
            throw error;
        });
};

const adminAdjustSettlement = async (claimId: number, settlementAmount: number): Promise<JSONResponse> => {
    return adminClaims.patch<JSONResponse<ModelFeatures>>(`/${claimId}/adjust-settlement/`, { settlementAmount }, {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error adjusting settlement:', error);
            throw error;
        });
};

/**
 *
 * USER FUNCTIONS
 *
 */

/**
 * Submit a claim for the current user.
 * @param claim - The claim submission payload.
 * @returns {Promise<JSONResponse>} - The response from the server.
 */
const submitClaim = async (claim: ModelFeatures): Promise<JSONResponse> => {
    return claims.post<JSONResponse<ModelFeatures>>('/submit/', mapToClaimData(claim), {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getTokenAccess(true),
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error submitting claim:', error);
            throw error;
        });
};

export {
    adminGetClaimsByStatus,
    adminUpdateClaim,
    adminGetClaimDetails,
    adminBulkUpdateClaims,
    adminSearchClaims,
    adminExportClaims,
    adminAdjustSettlement,
    submitClaim,
}