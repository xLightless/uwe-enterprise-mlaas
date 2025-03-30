import React, { useEffect, useState } from "react";
import PaginatedTable from "../../system-activity/network-activity/components/paginated-table";
import { usersResponse } from "../../../../../common/data";
import { TableData, UserProps } from "../../../../../common/interfaces";

import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js/auto";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";

ChartJS.register(MatrixController, MatrixElement);


const Recovery: React.FC = () => {
    const [data, setTableData] = useState<TableData | null>(null);
    const [heatmapData, setHeatmapData] = useState<ChartData<"matrix"> | null>(null);

    const [newWeekUsers, setNewWeekUsers] = useState<number>(0);
    const [newMonthUsers, setNewMonthUsers] = useState<number>(0);
    const [newTotalUsers, setNewTotalUsers] = useState<number>(0);

    const fetchAccounts = async () => {
        const users = usersResponse.tbody.map(user => ({
            ...user,
            isVerified: user.isVerified ? "True" : "False",
            isActive: user.isActive ? "True" : "False",
            isStaff: user.isStaff ? "True" : "False",
            isAdmin: user.isAdmin ? "True" : "False",
            isSuperuser: user.isSuperuser ? "True" : "False",
            // lastLogin: user.lastLogin ? new Date(user.lastLogin).getTime() : ""
        }));

        const thead = usersResponse.thead.filter(
            column => column
            !== "userId"

        );

        const newUserResponse = {
            thead: thead,
            tbody: users
        }

        return newUserResponse;
    };

    const fetchData = async () => {
        const accountUsers = await fetchAccounts();
        setTableData(accountUsers);

        const heatmap = generateHeatmapData(accountUsers.tbody as unknown as UserProps[]);
        setHeatmapData(heatmap as ChartData<"matrix">);
    };

    const fetchUserAnalytics = async (data: TableData) => {
            // New users this week
            const newUsersThisWeek = data.tbody.filter((user: UserProps) => {
                const date = new Date(user.lastLogin as string);
                const currentDate = new Date();
                return date.getTime() >= currentDate.getTime() - 7 * 24 * 60 * 60 * 1000;
            }).length;

            // New users this month
            const newUsersThisMonth = data.tbody.filter((user: UserProps) => {
                const date = new Date(user.lastLogin as string);
                const currentDate = new Date();
                return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
            }).length;

            // New users to date
            const newUsersToDate = data.tbody.length;

            setNewWeekUsers(newUsersThisWeek);
            setNewMonthUsers(newUsersThisMonth);
            setNewTotalUsers(newUsersToDate);
    };

    // On mount, fetch the data, then fetch data analytics and render it.
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            fetchUserAnalytics(data);
        }
    }, [data]);

    const generateHeatmapData = (tbody: UserProps[]) => {
        const matrixData = tbody.map((user: UserProps) => {
            if (!user.lastLogin) return null;

            const date = new Date(user.lastLogin);
            const dayOfMonth = date.getDate();
            const dayOfWeek = date.getDay();

            return {
                x: dayOfMonth,
                y: dayOfWeek,
                v: date.getTime()
            };
        }).filter(Boolean);


        // Populate missing heatmap cells for better visualisation
        for (let day = 1; day <= 31; day++) {
            for (let weekDay = 0; weekDay < 7; weekDay++) {
                const existingKeys = new Set(
                    matrixData.map((day_) => `${day_ && day_.x}-${day_ && day_.y}`)
                );

                if (!existingKeys.has(`${day}-${weekDay}`)) {
                    matrixData.push({ x: day, y: weekDay, v: 0 });
                }
            }
        }

        return {
            datasets: [
                {
                    data: matrixData,
                    backgroundColor: (ctx: { raw: { v: number } }) => {
                        const value = ctx.raw.v;
                        if (value === 0) {
                            return "rgba(200, 200, 200, 1)";
                        }
                        const max = Date.now();
                        const daysInMonth = max - 30 * 24 * 60 * 60 * 1000;
                        const intensity = (value - daysInMonth) / (max - daysInMonth);
                        return `rgba(255, 0, 0, ${Math.max(0, Math.min(intensity, 1))})`;
                    },
                    height: (ctx: { chart: { width: number } }) => Math.min(Math.max(ctx.chart.width / 50, 2), 24), // Minimum 16px, Maximum 32px
                    width: (ctx: { chart: { width: number } }) => Math.min(Math.max(ctx.chart.width / 50, 2), 24),  // Minimum 16px, Maximum 32px
                }
            ]
        };
    };

    const heatmapOptions: ChartOptions<"matrix"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear",
                title: {
                    display: false,
                    text: "Days in the Month",
                    padding: 15,
                },
                min: 1,
                max: 31,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                    stepSize: 1,
                },
            },
            y: {
                type: "linear",
                min: 0,
                max: 6,
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                    padding: 15,
                    callback: (value) => {
                        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        return days[value as number];
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = (context.raw as { v: number }).v;
                        if (value === 0) {
                            return "No activity";
                        }

                        if (data) {
                            const hoveredDate = new Date(value);
                            const formattedDate = hoveredDate.toLocaleDateString();
                            const formattedTime = hoveredDate.toLocaleTimeString();

                            const usersOnDate = data.tbody.filter((user: UserProps) => {
                                const userLoginDate = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : null;
                                return userLoginDate === formattedDate;
                            });

                            const emails = usersOnDate.map((user: UserProps) => user.email).join(", ");
                            return `${emails} | ${formattedDate} - ${formattedTime}`;
                        }

                        return "No data available";
                    }
                }
            }
        },
        layout: {
            autoPadding: true,
        },
    };

    return (
        <>
            <div className="w-full h-full grid grid-rows-[0.2fr_0.5fr_1fr] gap-4">
                {/* Account Management stats */}
                <div className="w-full h-full grid xs:grid-rows-3 lg:grid-cols-3 gap-2 sm:gap-4">
                    <div className="order-1 w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md flex flex-col justify-center items-center p-2 sm:p-4 hover:scale-105 transition-transform duration-300">
                        <h1 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">New Users This Week</h1>
                        <p className="text-lg sm:text-2xl font-extrabold">{data ? newWeekUsers : "N/A"}</p>
                    </div>
                    <div className="order-2 w-full h-full bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md flex flex-col justify-center items-center p-2 sm:p-4 hover:scale-105 transition-transform duration-300">
                        <h1 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">New Users This Month</h1>
                        <p className="text-lg sm:text-2xl font-extrabold">{data ? newMonthUsers : "N/A"}</p>
                    </div>
                    <div className="order-3 w-full h-full bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow-md flex flex-col justify-center items-center p-2 sm:p-4 hover:scale-105 transition-transform duration-300">
                        <h1 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2">Users To Date</h1>
                        <p className="text-lg sm:text-2xl font-extrabold">{data ? newTotalUsers : "N/A"}</p>
                    </div>
                </div>

                <div className="w-full bg-white rounded shadow-md flex justify-center items-center overflow-x-auto">
                    {heatmapData && (
                        <Chart
                            type="matrix"
                            data={heatmapData}
                            options={heatmapOptions}
                            className="max-w-full py-2"
                        />
                    )}
                </div>

                {/* Table of Accounts */}
                {data &&
                    <PaginatedTable
                        thead={data.thead}
                        tbody={data.tbody}
                        placeHolder={"Search network activity..."}
                        onCloseValue={false}
                        onClose={() => {}}
                        filterOptions={
                            [
                                "isVerified",
                                "isActive",
                                "isStaff",
                                "isAdmin",
                                "isSuperuser"
                            ]
                        }
                    >

                        <></>
                    </PaginatedTable>
                }
            </div>
        </>
    )
};

export default Recovery;