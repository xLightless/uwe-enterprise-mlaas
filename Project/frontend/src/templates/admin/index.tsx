import React, { JSX, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCommentNodes,
    faCreditCard,
    faFileInvoice,
    faMicrochip,
    faNetworkWired,
    faServer,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { SidebarItem } from '../../common/interfaces';
import Dashboard from '../../components/dashboard';
import NetworkActivity from './content/system-activity/network-activity';
import AuditLogs from './content/system-activity/audit-logs';
import MLAAS_Traffic from './content/system-activity/mlaas-traffic';
import RolesPermissions from './content/manage-accounts/roles-permissions';
import Recovery from './content/manage-accounts/recovery';
import DataRegulation from './content/manage-accounts/data-regulation';
import { Invoices } from './content/finances';
import { RoleProvider } from '../../common/contexts/role';
import { UserProvider } from '../../common/contexts/user';
import ClaimsHandling from './content/claims-handling';

/**
 * Wraps all providers and contexts of admin dashboard in a single component.
 * @param param0
 * @returns
 */
const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <UserProvider>
            <RoleProvider>
                {children}
            </RoleProvider>
        </UserProvider>
    )
};

const AdminDashboard: React.FC = () => {
    const componentMapping: { [key: string]: React.FC } = {
        // System Activity
        "Network Activity": NetworkActivity,
        "Audit Logs": AuditLogs,
        "MLAAS Traffic": MLAAS_Traffic,

        // Manage Accounts
        "Roles & Permissions": RolesPermissions,
        "Recovery": Recovery,
        "Data & Regulation": DataRegulation,

        // Finances
        "Invoices & Payments": Invoices,

        // Admin Claims Handling
        "Claims Handling": ClaimsHandling
    };

    const sidebarItems: SidebarItem[] = [
        {
            name: "System Activity",
            sideBarIcon: <FontAwesomeIcon icon={faServer} />,
            items: [
                ["Network Activity", () => onSidebarUpdate("Network Activity"), <FontAwesomeIcon key={1} icon={faNetworkWired} />],
                ["Audit Logs", () => onSidebarUpdate("Audit Logs"), <FontAwesomeIcon key={2} icon={faCommentNodes} />],
                ["MLAAS Traffic", () => onSidebarUpdate("MLAAS Traffic"), <FontAwesomeIcon key={3} icon={faMicrochip} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Manage Accounts",
            sideBarIcon: <FontAwesomeIcon icon={faUser} />,
            items: [
                ["Roles & Permissions", () => onSidebarUpdate("Roles & Permissions"), <FontAwesomeIcon key={4} icon={faNetworkWired} />],
                ["Recovery", () => onSidebarUpdate("Recovery"), <FontAwesomeIcon key={5} icon={faCommentNodes} />],
                ["Data & Regulation", () => onSidebarUpdate("Data & Regulation"), <FontAwesomeIcon key={6} icon={faMicrochip} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Review Finances",
            sideBarIcon: <FontAwesomeIcon icon={faCreditCard} />,
            items: [
                ["Invoices & Payments", () => onSidebarUpdate("Invoices"), <FontAwesomeIcon key={7} icon={faFileInvoice} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Claims Handling",
            sideBarIcon: <FontAwesomeIcon icon={faFileInvoice} />,
            items: [
                ["Claims Handling", () => onSidebarUpdate("Claims Handling"), <FontAwesomeIcon key={8} icon={faFileInvoice} />],
            ] as [string, () => void | null, JSX.Element | null][],
        }
    ];


    /**
     * Gets the relative sidebar item, if applicable,
     * based on the last clicked item.
     *
     * @returns {string} - The sidebar item to render.
     */
    const getRelativeSidebarDisplay = () => {
        const itemIndex = localStorage.getItem('clickedItemIndex');
        if (itemIndex !== null) {
            const index = parseInt(itemIndex, 10);
            let idx = 0;
            for (const component of sidebarItems) {
                for (const item of component.items) {
                    if (idx === index) {
                        return item[0];
                    }
                    idx++;
                }
            }
        }
        return "Network Activity";
    };
    const [displayChoice, setDisplayChoice] = useState<string>(getRelativeSidebarDisplay);

    function onSidebarUpdate(name: string) {
        setDisplayChoice(name);
    };

    /**
     * Creates a map of components and render
     * them based on the sidebar item clicked.
     */
    const DisplayComponent = componentMapping[displayChoice];

    return (
        // searchBarOptions={componentMapping}
        <Dashboard sideBarItems={sidebarItems} onDisplayUpdate={onSidebarUpdate}>
            <div className="grid grid-rows-[auto_1fr] w-full h-full gap-y-4">
                {/* Descriptor */}
                <div className="flex items-center justify-start">
                    <h1 className="font-bold">
                        Dashboard
                        <span className="typography"> / {displayChoice}</span>
                    </h1>
                </div>

                {/*
                    Wrap the admin dashboard with role context
                    to allow cached permissible states.
                */}
                <Providers>
                    <DisplayComponent />
                </Providers>
            </div>
        </Dashboard>
    )
};


export default AdminDashboard;