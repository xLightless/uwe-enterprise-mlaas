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
    name: string;
}

export interface Role {
    roleId: number;
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
    isAdmin?: boolean | string;
    isStaff?: boolean | string;
    isSuperuser?: boolean | string;

    actions?: JSX.Element;
}

export interface JSONResponse<T = any> {
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
    model_name: string
    model_description: string
    model_version: string
    model_file: string
}

export interface ModelStatistics {
    num_accepted_claims: number
    num_rejected_claims: number
}