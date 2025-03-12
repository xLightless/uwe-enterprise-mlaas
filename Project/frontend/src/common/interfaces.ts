import { JSX } from "react";

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
    [key: string]: string | number | Date;
}

export interface TableData {
    thead: string[];
    tbody: TableRow[];
    maxRowsPerPage?: number;
}

export interface ReactChildProp {
    children: React.ReactNode;

    /**
     * When clicking on an id of a user this updates
     * the interface with the user id's information.
     * @param userId
     */
    onUserIdClick?: (userId: number) => void;
};

export interface UserProps {
    user: {
        userId?: number;
        roleId?: number;
        fullName?: string;
        email?: string;
        password?: string;
        phoneNumber?: string;
        created_at?: Date;
        updated_at?: Date;
        last_login?: Date;
        isVerified?: boolean;
        isActive?: boolean;
        isAdmin?: boolean;
        isStaff?: boolean;
        isSuperuser?: boolean;
    }
}