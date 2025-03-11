import React, { JSX } from 'react';
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

const AdminDashboard: React.FC = () => {

    const sidebarItems: SidebarItem[] = [
        {
            name: "System Activity",
            sideBarIcon: <FontAwesomeIcon icon={faServer} />,
            items: [
                ["Network Activity", () => {}, <FontAwesomeIcon icon={faNetworkWired} />],
                ["Audit Logs", () => {}, <FontAwesomeIcon icon={faCommentNodes} />],
                ["MLAAS Traffic", () => {}, <FontAwesomeIcon icon={faMicrochip} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Manage Users",
            sideBarIcon: <FontAwesomeIcon icon={faUser} />,
            items: [
                ["Roles & Permissions", () => {}, <FontAwesomeIcon icon={faNetworkWired} />],
                ["Recovery", () => {}, <FontAwesomeIcon icon={faCommentNodes} />],
                ["Data & Regulation", () => {}, <FontAwesomeIcon icon={faMicrochip} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Review Finances",
            sideBarIcon: <FontAwesomeIcon icon={faCreditCard} />,
            items: [
                ["Invoices", () => {}, <FontAwesomeIcon icon={faFileInvoice} />],
                ["Billing", () => {}, <FontAwesomeIcon icon={faCreditCard} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
    ];


    return (
        <Dashboard sideBarItems={sidebarItems}>
            <></>
        </Dashboard>
    )
};


export default AdminDashboard;