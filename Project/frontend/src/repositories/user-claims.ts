import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL: API_URL
});

axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface ClaimSubmission {
    gender: string;
    driverAge: number;
    vehicleType: string;
    vehicleAge: number;
    passengers: number;
    exceptional: string;
    accidentType: string;
    accidentDate: string;
    weatherConditions: string;
    policeReport: string;
    witness: string;
    accidentDescription: string;
    dominantInjury: string;
    prognosis: number;
    whiplash: string;
    psychological: string;
    injuryDescription: string;
    assetDamage: number;
    earningsLoss: number;
    usageLoss: number;
    generalFixes: number;
    specialFixes: number;
    tripCosts: number;
    journeyExpenses: number;
    medications: number;
    rehabilitation: number;
    therapy: number;
    healthExpenses: number;
    specialReduction: number;
    specialOverage: number;
    generalRest: number;
    additionalInjury: number;
    generalUplift: number;
    loanerVehicle: number;
}

export interface ClaimDetails extends ClaimSubmission {
    claimId: string;
    settlementAmount: string | number;
    claimDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'settled';
}

export const submitClaim = async (claimData: ClaimSubmission) => {
    try {
        const formatDate = (isoDate: string) => {
            if (!isoDate) return "";

            const date = new Date(isoDate);

            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(',', '');
        };

        const payload = {
            'Gender': claimData.gender,
            'Driver Age': claimData.driverAge || 0,
            'Vehicle Type': claimData.vehicleType,
            'Vehicle Age': claimData.vehicleAge || 0,
            'Number of Passengers': claimData.passengers || 0,
            'Exceptional_Circumstances': claimData.exceptional === 'yes',
            'AccidentType': claimData.accidentType,
            'Accident Date': formatDate(claimData.accidentDate),
            'Weather Conditions': claimData.weatherConditions,
            'Police Report Filed': claimData.policeReport === 'yes',
            'Witness Present': claimData.witness === 'yes',
            'Accident Description': claimData.accidentDescription,
            'Dominant_injury': claimData.dominantInjury,
            'Injury_Prognosis': claimData.prognosis || 0,
            'Whiplash': claimData.whiplash === 'yes',
            'Minor_Psychological_Injury': claimData.psychological === 'yes',
            'Injury Description': claimData.injuryDescription,
            'SpecialAssetDamage': claimData.assetDamage || 0,
            'SpecialEarningsLoss': claimData.earningsLoss || 0,
            'SpecialUsageLoss': claimData.usageLoss || 0,
            'GeneralFixed': claimData.generalFixes || 0,
            'SpecialFixes': claimData.specialFixes || 0,
            'SpecialTripCosts': claimData.tripCosts || 0,
            'SpecialJourneyExpenses': claimData.journeyExpenses || 0,
            'SpecialMedication': claimData.medications || 0,
            'SpecialRehabilitation': claimData.rehabilitation || 0,
            'SpecialTherapy': claimData.therapy || 0,
            'SpecialHealthExpenses': claimData.healthExpenses || 0,
            'SpecialReduction': claimData.specialReduction || 0,
            'SpecialOverage': claimData.specialOverage || 0,
            'GeneralRest': claimData.generalRest || 0,
            'SpecialAdditionalInjury': claimData.additionalInjury || 0,
            'GeneralUplift': claimData.generalUplift || 0,
            'SpecialLoanerVehicle': claimData.loanerVehicle || 0,
            'Claim Date': formatDate(new Date().toISOString())
        };

        console.log("Submitting claim with payload:", payload);
        
        const response = await axiosInstance.post('/claims/submit/', payload);
        console.log("Claim submission response:", response.data);

        return response.data;
    } catch (error: unknown) {
        console.error("Submit claim error:", error);

        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }

        throw error;
    }
};

interface RawClaimData {
    claim_id?: string;
    claim_date?: string;
    predicted_settlement?: number | string;
    status?: string;
    accident_type?: string;
    [key: string]: any;
}

export const getUserClaims = async () => {
    try {
        const response = await axiosInstance.get('/claims/list/');
        console.log("API Response:", response.data);
        
        const rawClaims = Array.isArray(response.data) ? response.data : response.data && Array.isArray(response.data.claims) ? response.data.claims : [];
        
        return rawClaims.map((claim: RawClaimData) => {
            return {
                claimId: claim.claim_id || "",
                claimDate: claim.claim_date || "",
                settlementAmount: typeof claim.predicted_settlement === 'number' ? `£${claim.predicted_settlement.toFixed(2)}` : claim.predicted_settlement || "£0",
                status: claim.status || "",
                accidentType: claim.accident_type || "",
                
                _rawData: claim
            };
        });
    } catch (error) {
        console.error('Error fetching user claims:', error);

        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }

        throw error;
    }
};

export const getClaimDetails = async (claimId: string) => {
    try {
        const response = await axiosInstance.get(`/claims/${claimId}/`);
        console.log("Claim details response:", response.data);
        
        const data = response.data;
        
        const details = {
            gender: data.driver_info?.gender || data.gender || "N/A",
            driverAge: Number(data.driver_info?.driver_age || data.driver_age || 0),
            vehicleType: data.vehicle_info?.vehicle_type || data.vehicle_type || "N/A",
            vehicleAge: Number(data.vehicle_info?.vehicle_age || data.vehicle_age || 0),
            passengers: Number(data.driver_info?.number_of_passengers || data.number_of_passengers || 0),
            exceptional: data.injury_indicators?.exceptional_circumstances ? "yes" : "no",
            accidentType: data.accident_info?.accident_type || data.accident_type || "N/A",
            accidentDate: data.accident_info?.accident_date || data.accident_date || "N/A",
            weatherConditions: data.accident_info?.weather_conditions || data.weather_conditions || "N/A",
            policeReport: data.accident_info?.police_report_filed ? "yes" : "no",
            witness: data.accident_info?.witness_present ? "yes" : "no",
            accidentDescription: data.accident_info?.accident_description || data.accident_description || "N/A",
            dominantInjury: data.injury_indicators?.dominant_injury || data.dominant_injury || "N/A",
            prognosis: Number(data.injury_info?.injury_prognosis || data.injury_prognosis || 0),
            whiplash: data.injury_indicators?.whiplash ? "yes" : "no",
            psychological: data.injury_indicators?.minor_psychological_injury ? "yes" : "no",
            injuryDescription: data.injury_info?.injury_description || data.injury_description || "N/A",
            assetDamage: Number(data.special_damages?.asset_damage || data.SpecialAssetDamage || 0),
            earningsLoss: Number(data.special_damages?.earnings_loss || data.SpecialEarningsLoss || 0),
            usageLoss: Number(data.special_damages?.usage_loss || data.SpecialUsageLoss || 0),
            generalFixes: Number(data.general_damages?.fixed || data.GeneralFixed || 0),
            specialFixes: Number(data.special_damages?.fixes || data.SpecialFixes || 0),
            tripCosts: Number(data.special_damages?.trip_costs || data.SpecialTripCosts || 0),
            journeyExpenses: Number(data.special_damages?.journey_expenses || data.SpecialJourneyExpenses || 0),
            medications: Number(data.special_damages?.medication || data.SpecialMedication || 0),
            rehabilitation: Number(data.special_damages?.rehabilitation || data.SpecialRehabilitation || 0),
            therapy: Number(data.special_damages?.therapy || data.SpecialTherapy || 0),
            healthExpenses: Number(data.special_damages?.health_expenses || data.SpecialHealthExpenses || 0),
            specialReduction: Number(data.special_damages?.reduction || data.SpecialReduction || 0),
            specialOverage: Number(data.special_damages?.overage || data.SpecialOverage || 0),
            generalRest: Number(data.general_damages?.rest || data.GeneralRest || 0),
            additionalInjury: Number(data.special_damages?.additional_injury || data.SpecialAdditionalInjury || 0),
            generalUplift: Number(data.general_damages?.uplift || data.GeneralUplift || 0),
            loanerVehicle: Number(data.special_damages?.loaner_vehicle || data.SpecialLoanerVehicle || 0)
        };
        
        return {
            claimId: data.claim_id || "",
            claimDate: data.claim_date || "",
            settlementAmount: `£${Number(data.predicted_settlement || data.settlement_amount || 0).toFixed(2)}`,
            status: data.status || "pending",
            details
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }

        throw error;
    }
};

export const getOngoingClaims = async () => {
    const claims = await getUserClaims();
    const claimsArray = Array.isArray(claims) ? claims : [];
    
    return claimsArray.filter(claim => 
        claim.status === 'pending' || claim.status === 'approved'
    );
};

export const getPastClaims = async () => {
    const claims = await getUserClaims();
    const claimsArray = Array.isArray(claims) ? claims : [];
    
    return claimsArray.filter(claim => 
        claim.status === 'settled' || claim.status === 'rejected'
    );
};

export const uploadClaimEvidence = async (claimId: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axiosInstance.post(`/claims/${claimId}/evidence/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }

        throw error;
    }
};

export const acceptClaim = async (claimId: string) => {
    try {
        const response = await axiosInstance.post(`/claims/${claimId}/accept/`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }

        throw error;
    }
};

export const refuseClaim = async (claimId: string, reason: string) => {
    try {
        const response = await axiosInstance.post(`/claims/${claimId}/refuse/`, { reason });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }

        throw error;
    }
};

export const submitClaimFeedback = async (claimId: string, feedback: { rating: number; comments: string }) => {
    try {
        const response = await axiosInstance.post(`/claims/${claimId}/feedback/`, feedback);

        return response.data;
    } catch (error) {
        console.error("Error submitting claim feedback:", error);

        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error;
        }
        
        throw error;
    }
};