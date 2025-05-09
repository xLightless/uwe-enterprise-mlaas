import React, { JSX } from "react";

/**
 * Navigation items for a sidebar.
 *
 * @name - The name of the sidebar item.
 * @items - The items in the sidebar under the name.
 * @items [n] - The name of the item, the function to call when the item is clicked, and the icon to display.
 */
export interface SidebarItem {
    name: string;
    sideBarIcon: JSX.Element;
    items: [string, () => void | null, JSX.Element | null, string?][];
}

export interface TableRow {
    [key: string]: string | number | Date | boolean | JSX.Element | null;
}

export interface TableData {
    thead: string[];
    tbody: TableRow[];
    maxRowsPerPage?: number;
}

export interface SearchBarProps {
    placeHolder: string;
}

export interface FilterByProps {
    filterOptions?: string[];
}

export interface ReactChildProp {
    children: React.ReactNode;

    /**
     * When clicking on an id of a user this updates
     * the interface with the user id's information.
     * @param userId
     */
    onUserIdClick?: (userId: number) => void;

    onCloseValue: boolean;
    onClose: () => void;
};

export interface Permission {
    permissionId?: number;
    permissionName: string;
}

export interface Role {
    roleId?: number;
    roleName: string;
    permissions: Permission[];
};

export interface CreateUserProps {
    email: string;
    password: string;
    roleId: number;
    fullName: string;
    phoneNumber: string;
}

export interface UserProps {
    userId?: number;
    roleId?: number;
    fullName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    createdAt?: string;
    lastLogin?: string;
    isVerified?: boolean | string;
    isActive?: boolean | string;

    actions?: JSX.Element;
}

export interface UserMeProps {
    userId: number;
    fullName: string;
    email: string;
    role: {
        roleId: number;
        roleName: string;
    }
    phoneNumber: string;
    isVerified: boolean;
    createdAt: string;
    lastLogin: string;
    isActive: boolean;
}

/**
 * API URL: 'http://localhost:8000/api/users' - Response
 */
export interface APIUsersProps {
    userId: number;
    email: string;
    fullName: string;
    role: Role;
    phoneNumber: string;
    isVerified: boolean;
    createdAt: string;
    lastLogin: string;
}

export interface JSONResponse<T = unknown> {
    status: string
    message: string
    data?: T
}

/**
 * Interface for mapping model properties to the frontend.
 *
 * @model_name - The name of the model.
 * @model_description - The description of the model.
 * @model_version - The version of the model.
 * @model_file - The file path of the model.
 */
export interface ModelProps {
    modelId?: number
    totalClaims?: number
    modelName: string
    modelDescription: string
    modelVersion: string
    uploadedAt: string
    isActive: boolean
    modelFile: string
    modelStatistics: ModelStatistics
}

export interface ModelStatistics {
    numAcceptedClaims: number
    numRejectedClaims: number
}

export interface ModelFeatures {
    gender: string;
    driverAge: string;
    vehicleType: string;
    vehicleAge: string;
    passengers: string;
    exceptional: string;
    accidentType: string;
    accidentDate: string;
    weatherConditions: string;
    policeReport: string;
    witness: string;
    accidentDescription: string;
    dominantInjury: string;
    prognosis: string;
    whiplash: string;
    psychological: string;
    injuryDescription: string;
    assetDamage: string;
    earningsLoss: string;
    usageLoss: string;
    generalFixes: string;
    specialFixes: string;
    tripCosts: string;
    journeyExpenses: string;
    medications: string;
    rehabilitation: string;
    therapy: string;
    healthExpenses: string;
    specialReduction: string;
    specialOverage: string;
    generalRest: string;
    additionalInjury: string;
    generalUplift: string;
    loanerVehicle: string;

    claimDate?: string;
}

export interface ModelFeaturesPredicted {
    gender: number;
    driverAge: number;
    vehicleType: number;
    vehicleAge: number;
    passengers: number;
    exceptional: number;
    accidentType: number;
    accidentDate: number;
    weatherConditions: number;
    policeReport: number;
    witness: number;
    accidentDescription: number;
    dominantInjury: number;
    prognosis: number;
    whiplash: number;
    psychological: number;
    injuryDescription: number;
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

export interface UserClaims {
    userClaimId?: number;
    userAccidentId?: number;
    claimId?: number;
    userId?: number;
    predictedSettlementValue?: number;
    pendingClaim?: string,
}

export interface AdminExportClaims {
    statusFilter: string;
    startDate: string;
    endDate: string;
}


export interface AdminSearchClaims {
    userName: string;
    userEmail: string;
    claimId: string;
    accidentType: string;
    status: string;
    minSettlement: number | null;
    maxSettlement: number | null;
    startDate: Date | null;
    endDate: Date | null;
    injuryType: string;
}

export interface UserInfo {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface AccidentInfo {
    accidentType: string;
    accidentDate: string;
    accidentDescription: string;
    weatherConditions: string;
}

export interface VehicleInfo {
    vehicleType: string;
    vehicleAge: number;
}

export interface DriverInfo {
    driverAge: number;
    gender: string;
    numberOfPassengers: number;
}

export interface ClaimInfo {
    claimDate: string;
    injuryPrognosis: string;
    injuryDescription: string;
    policeReportFiled: boolean;
    witnessPresent: boolean;
}

export interface SpecialDamages {
    healthExpenses: number;
    reduction: number;
    overage: number;
    additionalInjury: number;
    earningsLoss: number;
    usageLoss: number;
    medication: number;
    assetDamage: number;
    rehabilitation: number;
    fixes: number;
    loanerVehicle: number;
    tripCosts: number;
    journeyExpenses: number;
    therapy: number;
    totalSpecialDamages: number;
}

export interface GeneralDamages {
    rest: number;
    fixed: number;
    uplift: number;
    totalGeneralDamages: number;
}

export interface InjuryIndicators {
    exceptionalCircumstances: boolean;
    minorPsychologicalInjury: boolean;
    dominantInjury: string;
    whiplash: boolean;
}

export interface AdminClaimDetails {
    claimId: number;
    status: string;
    predictedSettlement: number;
    userInfo: UserInfo;
    accidentInfo: AccidentInfo;
    vehicleInfo: VehicleInfo;
    driverInfo: DriverInfo;
    claimInfo: ClaimInfo;
    specialDamages: SpecialDamages;
    generalDamages: GeneralDamages;
    injuryIndicators: InjuryIndicators;
    totalClaimedAmount: number;
}

/** to be used in /api/admin/claims/<pending_type> */
export interface Claim {
    claimId?: number;
    userEmail?: string;
    userName?: string;
    accidentType?: string;
    claimDate?: string;
    accidentDate?: string;
    status?: string;
    predictedSettlement?: number;
    // settledAmount: number;
    dominantInjury?: string;
    vehicleType?: string;
}

export interface AdminGetClaimsByStatus {
    claims: Claim[];
    // totalCount: number;
    // page: number;
    // pageSize: number;
    // totalPages: number;
}

export interface PaymentDetails {
    hasStripeAccount: boolean;
    stripeAccountReady: boolean;
    canLinkTestAccount: boolean;
}

export interface FinanceClaim {
    claimId: number;
    userEmail: string;
    userName: string;
    userPhone: string;
    accidentType: string;
    claimDate: string;
    dominantInjury: string;
    settlementAmount: number;
    paymentDetails: PaymentDetails;
}

export interface FinanceClaimsToSettle {
    claims: FinanceClaim[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface SessionContextProps {
    userId: number | null;
    role: {
        roleId: number | null;
        roleName: string | null;
        permissions: Permission[] | null;
    }
}

export function mapFinanceClaimsToSettle(data: Record<string, unknown>): FinanceClaimsToSettle {
    return {
        claims: (data["claims"] as Array<Record<string, unknown>>).map((claim) => ({
            claimId: claim["claim_id"] as number,
            userEmail: claim["user_email"] as string,
            userName: claim["user_name"] as string,
            userPhone: claim["user_phone"] as string,
            accidentType: claim["accident_type"] as string,
            claimDate: claim["claim_date"] as string,
            dominantInjury: claim["dominant_injury"] as string,
            settlementAmount: claim["settlement_amount"] as number,
            paymentDetails: {
                hasStripeAccount: (claim["payment_details"] as Record<string, unknown>)["has_stripe_account"] as boolean,
                stripeAccountReady: (claim["payment_details"] as Record<string, unknown>)["stripe_account_ready"] as boolean,
                canLinkTestAccount: (claim["payment_details"] as Record<string, unknown>)["can_link_test_account"] as boolean,
            },
        })),
        totalCount: data["total_count"] as number,
        page: data["page"] as number,
        pageSize: data["page_size"] as number,
        totalPages: data["total_pages"] as number,
    };
}

export function mapToClaimData(claim: unknown): Record<string, unknown> {
    return {
        "Accident Type": (claim as Record<string, unknown>)["accidentType"],
        "Injury_Prognosis": (claim as Record<string, unknown>)["prognosis"],
        "SpecialHealthExpenses": (claim as Record<string, unknown>)["healthExpenses"],
        "SpecialReduction": (claim as Record<string, unknown>)["specialReduction"],
        "SpecialOverage": (claim as Record<string, unknown>)["specialOverage"],
        "GeneralRest": (claim as Record<string, unknown>)["generalRest"],
        "SpecialAdditionalInjury": (claim as Record<string, unknown>)["additionalInjury"],
        "SpecialEarningsLoss": (claim as Record<string, unknown>)["earningsLoss"],
        "SpecialUsageLoss": (claim as Record<string, unknown>)["usageLoss"],
        "SpecialMedications": (claim as Record<string, unknown>)["medications"],
        "SpecialAssetDamage": (claim as Record<string, unknown>)["assetDamage"],
        "SpecialRehabilitation": (claim as Record<string, unknown>)["rehabilitation"],
        "SpecialFixes": (claim as Record<string, unknown>)["specialFixes"],
        "GeneralFixed": (claim as Record<string, unknown>)["generalFixes"],
        "GeneralUplift": (claim as Record<string, unknown>)["generalUplift"],
        "SpecialLoanerVehicle": (claim as Record<string, unknown>)["loanerVehicle"],
        "SpecialTripCosts": (claim as Record<string, unknown>)["tripCosts"],
        "SpecialJourneyExpenses": (claim as Record<string, unknown>)["journeyExpenses"],
        "SpecialTherapy": (claim as Record<string, unknown>)["therapy"],
        "Exceptional_Circumstances": (claim as Record<string, unknown>)["exceptional"],
        "Minor_Psychological_Injury": (claim as Record<string, unknown>)["psychological"],
        "Dominant injury": (claim as Record<string, unknown>)["dominantInjury"],
        "Whiplash": (claim as Record<string, unknown>)["whiplash"],
        "Vehicle Type": (claim as Record<string, unknown>)["vehicleType"],
        "Weather Conditions": (claim as Record<string, unknown>)["weatherConditions"],
        "Accident Date": (claim as Record<string, unknown>)["accidentDate"],
        "Claim Date": (claim as Record<string, unknown>)["claimDate"],
        "Vehicle Age": (claim as Record<string, unknown>)["vehicleAge"],
        "Driver Age": (claim as Record<string, unknown>)["driverAge"],
        "Number of Passengers": (claim as Record<string, unknown>)["passengers"],
        "Accident Description": (claim as Record<string, unknown>)["accidentDescription"],
        "Injury Description": (claim as Record<string, unknown>)["injuryDescription"],
        "Police Report Filed": (claim as Record<string, unknown>)["policeReport"],
        "Witness Present": (claim as Record<string, unknown>)["witness"],
        "Gender": (claim as Record<string, unknown>)["gender"],
    };
}

export function mapFromClaimData(claim: unknown): ModelFeatures {
    return {
        accidentType: (claim as Record<string, unknown>)["Accident Type"] as string,
        prognosis: (claim as Record<string, unknown>)["Injury_Prognosis"] as string,
        healthExpenses: (claim as Record<string, unknown>)["SpecialHealthExpenses"] as string,
        specialReduction: (claim as Record<string, unknown>)["SpecialReduction"] as string,
        specialOverage: (claim as Record<string, unknown>)["SpecialOverage"] as string,
        generalRest: (claim as Record<string, unknown>)["GeneralRest"] as string,
        additionalInjury: (claim as Record<string, unknown>)["SpecialAdditionalInjury"] as string,
        earningsLoss: (claim as Record<string, unknown>)["SpecialEarningsLoss"] as string,
        usageLoss: (claim as Record<string, unknown>)["SpecialUsageLoss"] as string,
        medications: (claim as Record<string, unknown>)["SpecialMedications"] as string,
        assetDamage: (claim as Record<string, unknown>)["SpecialAssetDamage"] as string,
        rehabilitation: (claim as Record<string, unknown>)["SpecialRehabilitation"] as string,
        specialFixes: (claim as Record<string, unknown>)["SpecialFixes"] as string,
        generalFixes: (claim as Record<string, unknown>)["GeneralFixed"] as string,
        generalUplift: (claim as Record<string, unknown>)["GeneralUplift"] as string,
        loanerVehicle: (claim as Record<string, unknown>)["SpecialLoanerVehicle"] as string,
        tripCosts: (claim as Record<string, unknown>)["SpecialTripCosts"] as string,
        journeyExpenses: (claim as Record<string, unknown>)["SpecialJourneyExpenses"] as string,
        therapy: (claim as Record<string, unknown>)["SpecialTherapy"] as string,
        exceptional: (claim as Record<string, unknown>)["Exceptional_Circumstances"] as string,
        psychological: (claim as Record<string, unknown>)["Minor_Psychological_Injury"] as string,
        dominantInjury: (claim as Record<string, unknown>)["Dominant injury"] as string,
        whiplash: (claim as Record<string, unknown>)["Whiplash"] as string,
        vehicleType: (claim as Record<string, unknown>)["Vehicle Type"] as string,
        weatherConditions: (claim as Record<string, unknown>)["Weather Conditions"] as string,
        accidentDate: (claim as Record<string, unknown>)["Accident Date"] as string,
        claimDate: (claim as Record<string, unknown>)["Claim Date"] as string,
        vehicleAge: (claim as Record<string, unknown>)["Vehicle Age"] as string,
        driverAge: (claim as Record<string, unknown>)["Driver Age"] as string,
        passengers: (claim as Record<string, unknown>)["Number of Passengers"] as string,
        accidentDescription: (claim as Record<string, unknown>)["Accident Description"] as string,
        injuryDescription: (claim as Record<string, unknown>)["Injury Description"] as string,
        policeReport: (claim as Record<string, unknown>)["Police Report Filed"] as string,
        witness: (claim as Record<string, unknown>)["Witness Present"] as string,
        gender: (claim as Record<string, unknown>)["Gender"] as string,
    };
}

/**
 * Map the API response to the AdminClaimDetails interface.
 * @param data - The API response data.
 * @returns {AdminClaimDetails} - The mapped data.
 */
export function mapAdminClaimDetails(data: Record<string, unknown>): AdminClaimDetails {
    return {
        claimId: data["claim_id"] as number,
        status: data["status"] as string,
        predictedSettlement: data["predicted_settlement"] as number,
        userInfo: {
            userId: (data["user_info"] as Record<string, unknown>)["user_id"] as number,
            fullName: (data["user_info"] as Record<string, unknown>)["full_name"] as string,
            email: (data["user_info"] as Record<string, unknown>)["email"] as string,
            phoneNumber: (data["user_info"] as Record<string, unknown>)["phone_number"] as string,
        },
        accidentInfo: {
            accidentType: (data["accident_info"] as Record<string, unknown>)["accident_type"] as string,
            accidentDate: (data["accident_info"] as Record<string, unknown>)["accident_date"] as string,
            accidentDescription: (data["accident_info"] as Record<string, unknown>)["accident_description"] as string,
            weatherConditions: (data["accident_info"] as Record<string, unknown>)["weather_conditions"] as string,
        },
        vehicleInfo: {
            vehicleType: (data["vehicle_info"] as Record<string, unknown>)["vehicle_type"] as string,
            vehicleAge: (data["vehicle_info"] as Record<string, unknown>)["vehicle_age"] as number,
        },
        driverInfo: {
            driverAge: (data["driver_info"] as Record<string, unknown>)["driver_age"] as number,
            gender: (data["driver_info"] as Record<string, unknown>)["gender"] as string,
            numberOfPassengers: (data["driver_info"] as Record<string, unknown>)["number_of_passengers"] as number,
        },
        claimInfo: {
            claimDate: (data["claim_info"] as Record<string, unknown>)["claim_date"] as string,
            injuryPrognosis: (data["claim_info"] as Record<string, unknown>)["injury_prognosis"] as string,
            injuryDescription: (data["claim_info"] as Record<string, unknown>)["injury_description"] as string,
            policeReportFiled: (data["claim_info"] as Record<string, unknown>)["police_report_filed"] as boolean,
            witnessPresent: (data["claim_info"] as Record<string, unknown>)["witness_present"] as boolean,
        },
        specialDamages: {
            healthExpenses: (data["special_damages"] as Record<string, unknown>)["health_expenses"] as number,
            reduction: (data["special_damages"] as Record<string, unknown>)["reduction"] as number,
            overage: (data["special_damages"] as Record<string, unknown>)["overage"] as number,
            additionalInjury: (data["special_damages"] as Record<string, unknown>)["additional_injury"] as number,
            earningsLoss: (data["special_damages"] as Record<string, unknown>)["earnings_loss"] as number,
            usageLoss: (data["special_damages"] as Record<string, unknown>)["usage_loss"] as number,
            medication: (data["special_damages"] as Record<string, unknown>)["medication"] as number,
            assetDamage: (data["special_damages"] as Record<string, unknown>)["asset_damage"] as number,
            rehabilitation: (data["special_damages"] as Record<string, unknown>)["rehabilitation"] as number,
            fixes: (data["special_damages"] as Record<string, unknown>)["fixes"] as number,
            loanerVehicle: (data["special_damages"] as Record<string, unknown>)["loaner_vehicle"] as number,
            tripCosts: (data["special_damages"] as Record<string, unknown>)["trip_costs"] as number,
            journeyExpenses: (data["special_damages"] as Record<string, unknown>)["journey_expenses"] as number,
            therapy: (data["special_damages"] as Record<string, unknown>)["therapy"] as number,
            totalSpecialDamages: (data["special_damages"] as Record<string, unknown>)["total_special_damages"] as number,
        },
        generalDamages: {
            rest: (data["general_damages"] as Record<string, unknown>)["rest"] as number,
            fixed: (data["general_damages"] as Record<string, unknown>)["fixed"] as number,
            uplift: (data["general_damages"] as Record<string, unknown>)["uplift"] as number,
            totalGeneralDamages: (data["general_damages"] as Record<string, unknown>)["total_general_damages"] as number,
        },
        injuryIndicators: {
            exceptionalCircumstances: (data["injury_indicators"] as Record<string, unknown>)["exceptional_circumstances"] as boolean,
            minorPsychologicalInjury: (data["injury_indicators"] as Record<string, unknown>)["minor_psychological_injury"] as boolean,
            dominantInjury: (data["injury_indicators"] as Record<string, unknown>)["dominant_injury"] as string,
            whiplash: (data["injury_indicators"] as Record<string, unknown>)["whiplash"] as boolean,
        },
        totalClaimedAmount: data["total_claimed_amount"] as number,
    };
}

/**
 * Map the API response to the AdminGetClaimsByStatus interface.
 * @param data - The API response data.
 * @return {AdminGetClaimsByStatus} - The mapped data.
 */
export function mapAdminGetClaimsByStatus(data: Record<string, unknown>): AdminGetClaimsByStatus {
    return {
        claims: (data["claims"] as Array<Record<string, unknown>>).map((claim) => ({
            claimId: claim["claim_id"] as number,
            userEmail: claim["user_email"] as string,
            userName: claim["user_name"] as string,
            accidentType: claim["accident_type"] as string,
            claimDate: claim["claim_date"] as string,
            accidentDate: claim["accident_date"] as string,
            status: claim["status"] as string,
            predictedSettlement: claim["predicted_settlement"] as number,
            // settledAmount: claim["settled_amount"] as number,
            dominantInjury: claim["dominant_injury"] as string,
            vehicleType: claim["vehicle_type"] as string,
        })),
        // totalCount: data["total_count"] as number,
        // page: data["page"] as number,
        // pageSize: data["page_size"] as number,
        // totalPages: data["total_pages"] as number,
    };
}

export function mapGetUserFromSession(data: Record<string, unknown>): UserMeProps {
    return {
        userId: data["user_id"] as number,
        fullName: data["full_name"] as string,
        email: data["email"] as string,
        role: {
            roleId: (data["role"] as Record<string, unknown>)["role_id"] as number,
            roleName: (data["role"] as Record<string, unknown>)["role_name"] as string,
        },
        phoneNumber: data["phone_number"] as string,
        isVerified: data["is_verified"] as boolean,
        createdAt: data["created_at"] as string,
        lastLogin: data["last_login"] as string,
        isActive: data["is_active"] as boolean,
    };
}

export function mapRole(data: Record<string, unknown>): Role {
    return {
        roleId: data["role_id"] as number,
        roleName: data["role_name"] as string,
        permissions: (data["permissions"] as Array<Record<string, unknown>>).map((permission) => ({
            permissionId: permission["permission_id"] as number,
            permissionName: permission["permission_name"] as string,
        })),
    };
}