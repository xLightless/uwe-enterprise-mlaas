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
    items: [string, () => void | null, JSX.Element | null][];
};

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