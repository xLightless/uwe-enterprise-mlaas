import React, { JSX, useEffect, useState } from 'react';
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

const AdminDashboard: React.FC = () => {
    const [displayChoice, setDisplayChoice] = useState<string | null>(null);

    function onSidebarUpdate(name: string) {
        setDisplayChoice(name);
    };

    const componentMapping: { [key: string]: React.FC } = {
        "Network Activity": NetworkActivity,
        "Audit Logs": AuditLogs,
        // "MLAAS Traffic": MLAAS_Traffic,
        // "Roles & Permissions": RolesPermissions,
        // "Recovery": Recovery,
        // "Data & Regulation": DataRegulation,
        // "Invoices": Invoices,
        // "Billing": Billing,
    };

    const sidebarItems: SidebarItem[] = [
        {
            name: "System Activity",
            sideBarIcon: <FontAwesomeIcon icon={faServer} />,
            items: [
                ["Network Activity", () => onSidebarUpdate("Network Activity"), <FontAwesomeIcon icon={faNetworkWired} />],
                ["Audit Logs", () => onSidebarUpdate("Audit Logs"), <FontAwesomeIcon icon={faCommentNodes} />],
                ["MLAAS Traffic", () => onSidebarUpdate("MLAAS Traffic"), <FontAwesomeIcon icon={faMicrochip} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Manage Accounts",
            sideBarIcon: <FontAwesomeIcon icon={faUser} />,
            items: [
                ["Roles & Permissions", () => onSidebarUpdate("Roles & Permissions"), <FontAwesomeIcon icon={faNetworkWired} />],
                ["Recovery", () => onSidebarUpdate("Recovery"), <FontAwesomeIcon icon={faCommentNodes} />],
                ["Data & Regulation", () => onSidebarUpdate("Data & Regulation"), <FontAwesomeIcon icon={faMicrochip} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Review Finances",
            sideBarIcon: <FontAwesomeIcon icon={faCreditCard} />,
            items: [
                ["Invoices", () => onSidebarUpdate("Invoices"), <FontAwesomeIcon icon={faFileInvoice} />],
                ["Billing", () => onSidebarUpdate("Billing"), <FontAwesomeIcon icon={faCreditCard} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
    ];

    /**
     * Creates a map of components and render
     * them based on the sidebar item clicked.
     */
    const DisplayComponent = displayChoice ? componentMapping[displayChoice] : null;

    return (
        <Dashboard sideBarItems={sidebarItems}>
            {DisplayComponent ? <DisplayComponent /> : null}
        </Dashboard>
    )
};


export default AdminDashboard;