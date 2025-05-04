import React, { useEffect, useState } from "react";
import PaginatedTable from "./components/paginated-table";
import { TableData, UserProps } from "../../../../../common/interfaces";
import UserSettingsDropdown from "../../../../../components/user-settings";
import NetworkConnectionsChart from "./components/charts/connections";
import { getActivityLogsNext, getPastConnections } from "../../../../../repositories/traffic";
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

        const fetchedInitialActivityLog = await getActivityLogsNext(previousPage, nextPage);
        // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
        const fetchedActivityLog = fetchedInitialActivityLog.data as Array<Object>;

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
            tbody: data ? [...data.tbody, ...transformedRows] : transformedRows
        };
        setNetworkActivityData(initialActivityData);
    };

    async function fetchNetworkUser(userId: number) {
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

    /**
     * Creates a chart of the daily connections
     * over a course of 3 months, if available.
     */
    async function fetchedChartData() {
        try {
            const response = await getPastConnections();
            console.log("Response:", response);

            if (response.status && response.message === "Activity log chart data retrieved successfully") {
                const pastConnections = response.data;

                if (Array.isArray(pastConnections)) {
                    const chartData = pastConnections.map((entry) => ({
                        date: entry.generated_at,
                        count: entry.total_connections,
                    }));

                    // Save the connection data into a state to be rendered by the chart.
                    setChartData(chartData);
                    console.log("Chart data successfully set:", chartData);
                } else {
                    console.warn("Invalid data format for pastConnections:", pastConnections);
                }
            } else {
                console.error("Unexpected response format or status:", response);
            }
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
        console.groupEnd();
    }

    useEffect(() => {
        async function fetchData() {
            await fetchNetworkActivity();
        }
        fetchData();
        fetchedChartData();
    }, [nextPage, previousPage]);

    return (
        <>
            {/* Network Traffic Analytics and Data */}
            <div className="w-full h-full grid grid-rows-[0.25fr_1fr]">

                {/* Graphs about connections */}
                {chartData &&
                    <div className="">
                        <NetworkConnectionsChart data={chartData} />
                    </div>
                }

                {!chartData &&
                    <div className="col-span-2 w-full h-full flex justify-center items-center">
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }

                {/* Paginated Table Data */}
                <div className={`col-span-2 bg-gray-200 ${data ? "h-fit" : "h-full"}`}>
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

                    {!data &&
                        <div className="w-full h-full flex justify-center items-center">
                            <p className="font-bold">No data to display.</p>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default NetworkActivity;