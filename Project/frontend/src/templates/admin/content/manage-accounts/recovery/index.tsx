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

    useEffect(() => {
        fetchData();
    }, []);

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
                    label: "Last Login Heatmap",
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
                    height: 15,
                    width: 15,
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
                    display: true,
                    text: "Days in the Month",
                    padding: 20,
                },
                min: 1,
                max: 31,
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
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
                    callback: (value) => {
                        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        return days[value as number];
                    },
                },
            },
        },
        plugins: {
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
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 sm: gap-x-4 gap-y-4">
                    <div className="w-full h-full bg-white rounded shadow-md flex justify-center items-center">
                        <h1 className="font-bold text-xl">New Users This Week</h1>
                    </div>
                    <div className="w-full h-full bg-white rounded shadow-md flex justify-center items-center">
                        <h1 className="font-bold text-xl">New Users This Month</h1>
                    </div>
                    <div className="w-full h-full bg-white rounded shadow-md flex justify-center items-center">
                        <h1 className="font-bold text-xl">New Users To Date</h1>
                    </div>
                </div>

                <div className="bg-white rounded shadow-md flex justify-center items-center">
                    {heatmapData && (
                        <Chart
                            type="matrix"
                            data={heatmapData}
                            options={heatmapOptions}
                            className="max-w-screen"
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