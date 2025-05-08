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
import { Invoices } from './content/finances';
import ClaimsHandling from './content/claims-handling';
import { useSession } from '../../common/contexts/user/session-context';

const AdminDashboard: React.FC = () => {
    const session = useSession();

    if (!session.hasPermission("view_admin_dashboard")) {
        return session.PermissionDenied();
    }

    const userPermissions = session.sessionContext?.role.permissions?.map((permission) => permission.permissionName) || [];

    const componentMapping: { [key: string]: React.FC } = {
        "Network Activity": NetworkActivity,
        "Audit Logs": AuditLogs,
        "MLAAS Traffic": MLAAS_Traffic,
        "Roles & Permissions": RolesPermissions,
        "Recovery": Recovery,
        "Invoices & Payments": Invoices,
        "Claims Handling": ClaimsHandling,
    };

    const sidebarItems: SidebarItem[] = [
        {
            name: "System Activity",
            sideBarIcon: <FontAwesomeIcon icon={faServer} />,
            items: [
                ["Network Activity", () => onSidebarUpdate("Network Activity"), <FontAwesomeIcon key={1} icon={faNetworkWired} />, "view_network_activity"],
                ["Audit Logs", () => onSidebarUpdate("Audit Logs"), <FontAwesomeIcon key={2} icon={faCommentNodes} />, "view_audit_logs"],
                ["MLAAS Traffic", () => onSidebarUpdate("MLAAS Traffic"), <FontAwesomeIcon key={3} icon={faMicrochip} />, "view_mlaas_traffic"],
            ] as [string, () => void | null, JSX.Element | null, string][],
        },
        {
            name: "Manage Accounts",
            sideBarIcon: <FontAwesomeIcon icon={faUser} />,
            items: [
                ["Roles & Permissions", () => onSidebarUpdate("Roles & Permissions"), <FontAwesomeIcon key={4} icon={faNetworkWired} />, "view_role_permissions"],
                ["Recovery", () => onSidebarUpdate("Recovery"), <FontAwesomeIcon key={5} icon={faCommentNodes} />, "view_account_recovery"],
            ] as [string, () => void | null, JSX.Element | null, string][],
        },
        {
            name: "Review Finances",
            sideBarIcon: <FontAwesomeIcon icon={faCreditCard} />,
            items: [
                ["Invoices & Payments", () => onSidebarUpdate("Invoices & Payments"), <FontAwesomeIcon key={7} icon={faFileInvoice} />, "view_invoice_settlements"],
            ] as [string, () => void | null, JSX.Element | null, string][],
        },
        {
            name: "Claims Handling",
            sideBarIcon: <FontAwesomeIcon icon={faFileInvoice} />,
            items: [
                ["Claims Handling", () => onSidebarUpdate("Claims Handling"), <FontAwesomeIcon key={8} icon={faFileInvoice} />, "view_claims_handling"],
            ] as [string, () => void | null, JSX.Element | null, string][],
        }
    ];

    // Filter sidebar items based on user permissions
    const filteredSidebarItems = sidebarItems.map((section) => ({
        ...section,
        items: section.items.filter(([, , , permission]) => userPermissions.includes(permission)),
    })).filter((section) => section.items.length > 0);


    /**
     * Gets the relative sidebar item, if applicable,
     * based on the last clicked item.
     *
     * @returns {string} - The sidebar item to render.
     */
    const getRelativeSidebarDisplay = () => {
        const itemIndex = sessionStorage.getItem('clickedItemIndex');
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

        return "";
    };

    const [displayChoice, setDisplayChoice] = useState<string>(getRelativeSidebarDisplay);

    function onSidebarUpdate(name: string) {
        setDisplayChoice(name);
    };

    const DisplayComponent = componentMapping[displayChoice];

    const hasPermission = filteredSidebarItems.some((section) =>
        section.items.some((item) => item[0] === displayChoice)
    );
    const FallbackComponent = () => {
        const firstValidItem = filteredSidebarItems[0]?.items[0]?.[0];
        if (firstValidItem) {
            setDisplayChoice(firstValidItem);
            return componentMapping[firstValidItem] ? React.createElement(componentMapping[firstValidItem]) : null;
        }
        return null;
    };

    return (
        <Dashboard sideBarItems={filteredSidebarItems} onDisplayUpdate={onSidebarUpdate}>
            <div className="grid grid-rows-[auto_1fr] w-full h-full gap-y-4">
                <div className="flex items-center justify-start">
                    <h1 className="font-bold">
                        Dashboard
                        <span className="typography"> / {displayChoice}</span>
                    </h1>
                </div>

                {/* Adds fallback component to prevent rendering old pages. */}
                {hasPermission && DisplayComponent ? (
                    <DisplayComponent />
                ) : (
                    <FallbackComponent />
                )}
            </div>
        </Dashboard>
    );
};


export default AdminDashboard;