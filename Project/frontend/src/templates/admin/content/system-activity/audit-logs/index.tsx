import React, { useEffect, useState } from "react";
import PaginatedTable from "../network-activity/components/paginated-table";
import { auditLogResponse } from "../../../../../common/data";
import { TableData, UserProps } from "../../../../../common/interfaces";
import UserSettingsDropdown from "../../../../../components/user-settings";

const AuditLogs: React.FC = () => {

    const [audits, setAudits] = useState<TableData | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const [overlay, setOverlay] = useState<boolean>(false);

    async function fetchNetworkUser(userId: number) {

        // Replace with actual fetch request
        const userProp: UserProps = {
            fullName: "John Smith",
            email: "john.smith@example.com",
            phoneNumber: "123-456-7890",
            roleId: 1,
            userId: userId,
            createdAt: String(new Date()),
            // updatedAt: String(new Date()),
            lastLogin: String(new Date()),
            isVerified: true,
            isActive: true,
            isAdmin: true,
            isStaff: true,
            isSuperuser: true,
        }

        setUser(userProp ? userProp : null);
    };

    async function fetchAuditLogs() {
        setAudits(auditLogResponse);
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
            await fetchAuditLogs();
        }

        fetchData();
    }, []);

    return (
        <>
            <div className="h-full w-full">
                {audits &&
                    <PaginatedTable
                        thead={audits?.thead}
                        tbody={audits?.tbody}
                        onUserIdClick={(user) => {
                            onUserIdClick(user);
                            setOverlay(true);
                        }}
                        placeHolder={"Search audit logs..."}
                        onCloseValue={overlay}
                        onClose={() => setOverlay(false)}
                        maxRowsPerPage={20}
                        filterOptions={["User ID", "Action Type", "Table Name", "Table Column"]}
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
                                            {user && <UserSettingsDropdown user={{...user}} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </PaginatedTable>
                }
            </div>
        </>
    )
};

export default AuditLogs;