import React, { useEffect, useState } from "react";
import PaginatedTable from "./components/paginated-table";
import { TableData, UserProps } from "../../../../../common/interfaces";
import { response } from "../../../../../common/data";
import UserSettingsDropdown from "../../../../../components/user-settings";
import NetworkConnectionsChart from "./components/charts/connections";

const NetworkActivity: React.FC = () => {
    const [data, setNetworkActivityData] = useState<TableData>(response);
    const [user, setUser] = useState<UserProps | null>(null);

    const [chartData, setChartData] = useState<{ date: string, count: number }[]>([]);


    async function fetchNetworkActivity() {

        // Replace with actual fetch request
        return response;
    };

    async function fetchNetworkUser(userId: number) {

        // Replace with actual fetch request
        const userProp: UserProps = {
            user: {
                fullName: "John Smith",
                email: "john.smith@example.com",
                phoneNumber: "123-456-7890",
                roleId: 1,
                userId: userId,
                created_at: new Date(),
                updated_at: new Date(),
                last_login: new Date(),
                isVerified: true,
                isActive: true,
                isAdmin: true,
                isStaff: true,
                isSuperuser: true,
            }
        }

        setUser(userProp ? userProp : null);
    };

    /**
     * Fetches the network user then passes down into other
     * network components to check for information
     * about a clicked user.
     */
    function onUserIdClick(userId: number) {
        return fetchNetworkUser(userId);
    };

    useEffect(() => {
        async function fetchData() {
            const fetchedNetworkActivity = await fetchNetworkActivity();
            setNetworkActivityData(fetchedNetworkActivity);
        }
        fetchData();

        /**
         * Creates a chart of the daily connections
         * over a course of 3 months, if available.
         */
        const dailyConnections = response.tbody.reduce((acc: { [key: string]: number }, row) => {
            const date = new Date(row["Generated At"]).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});

        const data = Object.entries(dailyConnections).map(([date, count]) => ({
            date,
            count
        }));

        // Save the connection data into a state to be rendered by the chart.
        setChartData(data);
    }, []);

    return (
        <div className="w-full h-full grid grid-rows-[auto_1fr]">
            {/* Descriptor */}
            <div className="w-full flex items-center justify-start">
                <h1 className="font-bold">
                    Dashboard
                    <span className="typography"> / Network Activity</span>
                </h1>
            </div>

            {/* Network Traffic Analytics and Data */}
            <div className="w-full h-full grid grid-rows-[0.25fr_1fr]">

                {/* Graphs about connections */}
                <div className="">
                    <NetworkConnectionsChart data={chartData} />
                </div>

                {/* Paginated Table Data */}
                <div className="w-full h-full my-4">
                    <PaginatedTable
                        thead={data.thead}
                        tbody={data.tbody}
                        onUserIdClick={onUserIdClick}
                    >
                        {/* User ID overlay. */}
                        <div className="w-full h-52 bg-white rounded grid grid-rows-[auto_1fr_auto]">
                            <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                                <h1 className="font-bold">User ID Information</h1>
                            </div>

                            <div className="grid grid-cols-2 h-36">
                                <table className="">
                                    <tbody className="text-left">
                                        <tr className="w-fit">
                                            <th className="text-black">First Name:</th>
                                            <td>John</td>
                                        </tr>
                                        <tr className="text-black">
                                            <th>Last Name:</th>
                                            <td>Smith</td>
                                        </tr>
                                        <tr className="text-black">
                                            <th>User Role:</th>
                                            <td>Insurer</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="w-full h-full flex justify-end items-start">
                                    <div>
                                        {user && <UserSettingsDropdown {...user} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PaginatedTable>
                </div>
            </div>
        </div>
    );
};

export default NetworkActivity;