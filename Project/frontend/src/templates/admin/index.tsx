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
                ["Invoices", () => onSidebarUpdate("Invoices"), <FontAwesomeIcon key={7} icon={faFileInvoice} />],
                ["Billing", () => onSidebarUpdate("Billing"), <FontAwesomeIcon key={8} icon={faCreditCard} />],
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