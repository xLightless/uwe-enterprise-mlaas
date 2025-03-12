import React from 'react';
import Dashboard from "../../../components/dashboard";


/**
 * An example dashboard for testing purposes.
 */
const TestDashboard: React.FC = () => {
    return (
        <Dashboard sideBarItems={[]}>
            {/*
                Populate the sidebar with items and create
                states within the dashboard, so when clicked
                the user goes to that part of the page rather
                than redirecting to a new url.
             */}
            <></>
        </Dashboard>
    )
};

export default TestDashboard;