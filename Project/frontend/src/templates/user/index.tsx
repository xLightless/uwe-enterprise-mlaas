import React, { JSX, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faHistory,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { SidebarItem } from '../../common/interfaces';
import Dashboard from '../../components/dashboard';
import UserDetails from './content/user-details';
import SubmitClaim from './content/submit-claim';
import OngoingClaims from './content/ongoing-claims';
import PastClaims from './content/past-claims';

const UserDashboard: React.FC = () => {
    const componentMapping: { [key: string]: React.FC } = {
        "User Details": UserDetails,
        "Submit Claim": SubmitClaim,
        "Ongoing Claims": OngoingClaims,
        "Past Claims": PastClaims,
    };

    const sidebarItems: SidebarItem[] = [
        {
            name: "Profile",
            sideBarIcon: <FontAwesomeIcon icon={faUser} />,
            items: [
                ["User Details", () => onSidebarUpdate("User Details"), <FontAwesomeIcon key={1} icon={faUser} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
        {
            name: "Claims",
            sideBarIcon: <FontAwesomeIcon icon={faFileAlt} />,
            items: [
                ["Submit Claim", () => onSidebarUpdate("Submit Claim"), <FontAwesomeIcon key={2} icon={faFileAlt} />],
                ["Ongoing Claims", () => onSidebarUpdate("Ongoing Claims"), <FontAwesomeIcon key={4} icon={faHistory} />],
                ["Past Claims", () => onSidebarUpdate("Past Claims"), <FontAwesomeIcon key={5} icon={faHistory} />],
            ] as [string, () => void | null, JSX.Element | null][],
        },
    ];

    const [displayChoice, setDisplayChoice] = useState<string>("User Details");

    function onSidebarUpdate(name: string) {
        setDisplayChoice(name);
    }

    const DisplayComponent = componentMapping[displayChoice];

    return (
        <Dashboard sideBarItems={sidebarItems}>
            <DisplayComponent />
        </Dashboard>
    )
};

export default UserDashboard;