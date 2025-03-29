import React, { useEffect, useState } from "react";
import PaginatedTable from "../../system-activity/network-activity/components/paginated-table";
import { usersResponse } from "../../../../../common/data";
import { TableData } from "../../../../../common/interfaces";


const Recovery: React.FC = () => {
    const [data, setTableData] = useState<TableData | null>(null);

    const fetchAccounts = async () => {
        const users = usersResponse.tbody.map(user => ({
            ...user,
            isVerified: user.isVerified ? "True" : "False",
            isActive: user.isActive ? "True" : "False",
            isStaff: user.isStaff ? "True" : "False",
            isAdmin: user.isAdmin ? "True" : "False",
            isSuperuser: user.isSuperuser ? "True" : "False"
        }));

        const thead = usersResponse.thead.filter(
            column => column
            !== "userId"

        );

        const newUserResponse = {
            thead: thead,
            tbody: users
        }

        // setTableData(newUserResponse);
        return newUserResponse;
    };

    const fetchData = async () => {
        const accountUsers =  await fetchAccounts();
        setTableData(accountUsers);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

                {/* Account Management stats */}
                <div className="w-full h-full bg-white rounded shadow-md flex justify-center items-center">
                    <h1 className="font-bold text-xl">DATA VISUALISATION</h1>
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