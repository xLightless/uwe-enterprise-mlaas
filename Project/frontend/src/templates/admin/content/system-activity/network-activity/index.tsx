import React, { useEffect, useState } from "react";
import PaginatedTable from "./components/paginated-table";
import { TableData, UserProps } from "../../../../../common/interfaces";
import { response } from "../../../../../common/data";
import UserSettingsDropdown from "../../../../../components/user-settings";
import NetworkConnectionsChart from "./components/charts/connections";
import { getActivityLogsNext } from "../../../../../repositories/traffic";
import { getUserDetails } from "../../../../../repositories/user";

const NetworkActivity: React.FC = () => {
    const [data, setNetworkActivityData] = useState<TableData | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    // const userContext = useUserContext();

    const [chartData, setChartData] = useState<{ date: string, count: number }[]>([]);

    const [overlay, setOverlay] = useState<boolean>(false);

    const maxRowsPerPage = 10;
    const startIndex = 0;
    const endIndex = maxRowsPerPage - 1;

    const [nextPage, setNextPage] = useState<number>(endIndex);
    const [previousPage, setPreviousPage] = useState<number>(startIndex);

    const heads = [
        // 'log_id',
        'user_id',
        'ip_address',
        'description',
        'status_code',
        'generated_at',
        'event_type',
        'device_info'
]

    async function fetchNetworkActivity() {
        // Replace with actual fetch request
        // return response;

        console.log("Fetching network activity data...", startIndex, endIndex);
        const fetchedInitialActivityLog = await getActivityLogsNext(previousPage, nextPage);
        const fetchedActivityLog = fetchedInitialActivityLog.data as Array<unknown>;

        // Formats the key value pairs to fix the backend team issues.
        const transformedRows = [];
        for (let i = 0; i < fetchedActivityLog.length; i++) {
            const row = fetchedActivityLog[i];
            const transformedRow = {
                log_id: row["log_id"],
                user_id: row["user"],
                ip_address: row["ip_address"],
                description: row["description"],
                status_code: row["status_code"],
                generated_at: row["generated_at"],
                event_type: row["event_type"],
                device_info: row["device_info"]
            };
            transformedRows.push(transformedRow);
        }

        const initialActivityData = {
            thead: heads,
            tbody: transformedRows
        }

        setNetworkActivityData(initialActivityData);
    };

    async function fetchNetworkUser(userId: number) {

        // // Replace with actual fetch request
        // const userProp: UserProps = {
        //     fullName: "John Smith",
        //     email: "john.smith@example.com",
        //     phoneNumber: "123-456-7890",
        //     roleId: 1,
        //     userId: userId,
        //     createdAt: String(new Date()),
        //     lastLogin: String(new Date()),
        //     isVerified: true,
        //     isActive: true,
        // }

        const fetchedUser = await getUserDetails(userId);
        const userData = fetchedUser.data;
        setUser({
            userId: userData.user_id,
            fullName: userData.full_name,
            email: userData.email,
            phoneNumber: userData.phone_number,
            roleId: userData.role.role_id,
            createdAt: String(userData.created_at),
            lastLogin: String(userData.last_login),
            isVerified: userData.is_verified,
            isActive: userData.is_active
        } as UserProps);

        setUserRole(userData.role.role_name);
    };

    /**
     * Fetches the network user then passes down into other
     * network components to check for information
     * about a clicked user.
     */
    function onUserIdClick(userId: number) {
        return fetchNetworkUser(userId);
    };

    const nextPageEvent = () => {
        console.log("Next page event triggered");
        setNextPage(nextPage + maxRowsPerPage);
        setPreviousPage(previousPage + maxRowsPerPage);
        fetchNetworkActivity();

    };

    const previousPageEvent = () => {
        console.log("Previous page event triggered");
        setNextPage(nextPage - maxRowsPerPage);
        setPreviousPage(previousPage - maxRowsPerPage);
        fetchNetworkActivity();
    }

    useEffect(() => {
        async function fetchData() {
            await fetchNetworkActivity();
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
    }, [nextPage, previousPage]);

    return (
        <>
            {/* Network Traffic Analytics and Data */}
            <div className="w-full h-full grid grid-rows-[0.25fr_1fr]">

                {/* Graphs about connections */}
                <div className="">
                    <NetworkConnectionsChart data={chartData} />
                </div>

                {/* Paginated Table Data */}
                <div className="w-full h-full my-4">
                    {data &&
                        <PaginatedTable
                            thead={data.thead}
                            tbody={data.tbody}
                            onUserIdClick={
                                (userId) => {
                                    onUserIdClick(userId);
                                    setOverlay(true);
                                }
                            }
                            placeHolder={"Search network activity..."}

                            onCloseValue={overlay}
                            onClose={() => setOverlay(false)}

                            onNextPageEvent={nextPageEvent}
                            onPreviousPageEvent={previousPageEvent}
                            maxRowsPerPage={maxRowsPerPage}
                            disableNextLastPage={false}
                            disablePreviousFirstPage={false}

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
                                                <th className="text-black">Name:</th>
                                                <td>{user?.fullName}</td>
                                            </tr>
                                            <tr className="text-black">
                                                <th>Email:</th>
                                                <td>{user?.email}</td>
                                            </tr>
                                            <tr className="text-black">
                                                <th>Role:</th>
                                                <td>{userRole}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="w-full h-full flex justify-end items-start">
                                        <div>
                                            {user && <UserSettingsDropdown user={{...user}} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PaginatedTable>
                    }
                </div>
            </div>
        </>
    );
};

export default NetworkActivity;