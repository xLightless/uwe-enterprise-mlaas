import React, { useEffect, useState } from "react";
import PaginatedTable from "../../system-activity/network-activity/components/paginated-table";
import { APIUsersProps, Role, TableData, UserProps } from "../../../../../common/interfaces";

import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js/auto";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import { useUserContext } from "../../../../../common/contexts/user";
import Overlay from "../../../../../components/overlay";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { adminUpdateUserDetails, createUser, deleteUserById, getUsers } from "../../../../../repositories/user";
import { getRoles } from "../../../../../repositories/roles";

ChartJS.register(MatrixController, MatrixElement);

const Recovery: React.FC = () => {
    // Information related to user(s)
    const userContext = useUserContext();
    const [data, setTableData] = useState<TableData | null>(null);
    const [heatmapData, setHeatmapData] = useState<ChartData<"matrix"> | null>(null);

    // Analytics
    const [newWeekUsers, setNewWeekUsers] = useState<number>(0);
    const [newMonthUsers, setNewMonthUsers] = useState<number>(0);
    const [newTotalUsers, setNewTotalUsers] = useState<number>(0);
    const [toggleEditUser, setToggleEditUser] = useState<boolean>(false);
    const [roles, setRoles] = useState<Role[]>([]);

    // Form data for creating a new account
    const filteredHeads = [
        "email",
        "role_name",
        "full_name",
        "phone_number",
        "created_at",
        "last_login",
        "is_verified",
        "is_active"
    ];
    const [newAccount, setNewAccount] = useState<UserProps | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showEditUserPassword, setShowEditUserPassword] = useState<boolean>(false);
    const [showEditUserNewPassword, setShowEditUserNewPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [checkConfirmPassword, setCheckConfirmPassword] = useState<string>("");
    const [creationStatusMessage, setCreationStatusMessage] = useState<string>("");
    const [toggleDeleteAccountPopUp, setToggleDeleteAccountPopUp] = useState<boolean>(false);
    const [deleteAccountPopUpContext, setDeleteAccountPopUpContext] = useState<UserProps | null>(null);

    // Create a new user account in the database, on form submission.
    function createNewUser(e: React.FormEvent, newAccount: UserProps | null) {
        e.preventDefault();

        alert(
            `${newAccount?.email} | ${newAccount?.password} | ${newAccount?.roleId} | ${newAccount?.fullName} | ${newAccount?.phoneNumber}`
        )

        // Check for missing or invalid fields first
        if (!newAccount) {
            setCreationStatusMessage("Failed to create user account. Please fill in all fields.");
            return;
        }

        if (!newAccount.email) {
            setCreationStatusMessage("Please enter an email address.");
            return;
        }

        if (!newAccount.password) {
            setCreationStatusMessage("Please enter a password.");
            return;
        }

        if (checkConfirmPassword !== newAccount.password) {
            setCreationStatusMessage("Passwords do not match.");
            return;
        }

        if (!newAccount.roleId || newAccount.roleId === -1) {
            setCreationStatusMessage("Please select a role for the user.");
            return;
        }

        if (!newAccount.fullName) {
            setCreationStatusMessage("Please enter a full name.");
            return;
        }

        if (!newAccount.phoneNumber) {
            setCreationStatusMessage("Please enter a phone number.");
            return;
        }

        // Create the new user in the system.
        createUser({
            email: newAccount.email,
            password: newAccount.password,
            role_id: newAccount.roleId,
            full_name: newAccount.fullName,
            phone_number: newAccount.phoneNumber,
            is_verified: newAccount.isVerified,
            is_active: newAccount.isActive,
        } as UserProps)


    }

    // Opens the user settings editor for the selected user.
    const editUser = (user: UserProps) => {
        setToggleEditUser(true);
        userContext.setUser(user);
    };

    const editUserSubmit = async (user: unknown) => {
        let editedUser = {
            email: user.email,
            fullName: user.full_name,
            roleId: user.role.role_id,
            phoneNumber: user.phone_number,
            isVerified: user.is_verified,
            isActive: user.is_active,

            // Promise removes nulled password for better query and security,
            // unless updated by new password.
            password: undefined,
        } as UserProps;

        if (showEditUserNewPassword.length > 0) {
            editedUser = {
                ...editedUser,
                password: showEditUserNewPassword,
            }
        }

        await adminUpdateUserDetails(
            user.user_id as number,
            editedUser as UserProps
        ).catch((error) => {
            console.error("Error updating user:", error);
        })

        fetchData();
    };

    // Deletes the selected user account in the database.
    const deleteAccount = (userId: number) => {
        deleteUserById(userId);
        fetchData();
    }

    const fetchAccounts = async () => {
        const fetchedUsers = await getUsers();
        const fetchedUsersData = fetchedUsers.data;

        const users = fetchedUsersData?.map((user: APIUsersProps) => ({
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            role_name: user.role.role_name,
            phone_number: user.phone_number,
            created_at: user.created_at,
            last_login: user.last_login,
            is_verified: user.is_verified ? `true` : `false`,
            is_active: user.is_active ? `true` : `false`,
            actions: (
            <div className="flex flex-row gap-2">
                <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                onClick={() => editUser(user as UserProps)}
                >
                Edit
                </button>
                <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400 transition"
                onClick={() => {
                    setToggleDeleteAccountPopUp(true);
                    setDeleteAccountPopUpContext(user as UserProps);
                }}
                >
                Suspend User
                </button>
            </div>
            ),
        }));

        const newUserResponse = {
            thead: [...filteredHeads, "actions"],
            tbody: users
        }

        return newUserResponse;
    };

    const fetchData = async () => {
        const accountUsers = await fetchAccounts();
        setTableData(accountUsers as TableData);

        const heatmap = generateHeatmapData(accountUsers.tbody as unknown as UserProps[]);
        setHeatmapData(heatmap as ChartData<"matrix">);
    };

    const fetchRoles = async () => {
        const fetchedRoles = await getRoles();
        if (fetchedRoles.data) {
            const rolesData = fetchedRoles.data.map((role: Role) => ({
                roleId: role.role_id,
                roleName: role.role_name,
                // permissions: role.permissions,
            } as Role));
            setRoles(rolesData);
        }
    };


    // Get the role ID from the role name
    const getRoleIdFromName = async (roleName: string) => {
        const roleId = roles.find(role => role.roleName === roleName)?.roleId
        // alert(`Role Name: ${roleName} | Role ID: ${roleId}`);
        return roleId || -1;
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

    useEffect(() => {
        fetchRoles();
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            fetchUserAnalytics(data);
        }
    }, [editUserSubmit]);

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
            {toggleDeleteAccountPopUp && deleteAccountPopUpContext &&
                <Overlay onClose={() => setToggleDeleteAccountPopUp(false)} className="max-w-lg">
                    <div className="w-full h-fit bg-white rounded grid grid-rows-[auto_1fr_auto] p-4">
                        <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                            <h1 className="font-bold">Suspend Account: {deleteAccountPopUpContext.email}</h1>
                        </div>
                        <div className="w-full h-full flex justify-center items-center grid grid-rows-2">
                            <p className="text-black">Are you sure you want to temporarily delete this user&apos;s account?</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                onClick={() => {
                                    // Delete user logic here
                                    deleteAccount(deleteAccountPopUpContext.user_id as number);
                                    setToggleDeleteAccountPopUp(false);
                                    fetchData();
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </Overlay>
            }

            {toggleEditUser &&
                <Overlay onClose={() => {
                    setToggleEditUser(false);
                    fetchData();
                }} className="max-w-lg">
                    <div className="w-full h-fit bg-white rounded grid grid-rows-[auto_1fr_auto] p-4">
                        {/* Header */}
                        <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                            <h1 className="font-bold">Edit User Information</h1>
                        </div>

                        {/* User Information Table */}
                        <div className="grid grid-cols-1">
                            <table className="w-full text-left">
                                <tbody>
                                    {/* Full Name */}
                                    <tr className="">
                                        <th className="text-black pr-4">Full Name:</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="w-full h-10 border border-gray-300 rounded-md px-4"
                                                value={userContext.getUser()?.full_name || userContext.getUser()?.fullName || ""}
                                                onChange={(e) =>
                                                    userContext.setUser({
                                                        ...userContext.getUser(),
                                                        full_name: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                    </tr>

                                    {/* Email */}
                                    <tr>
                                        <th className="text-black pr-4">Email:</th>
                                        <td>
                                            <input
                                                type="email"
                                                className="w-full h-10 border border-gray-300 rounded-md px-4"
                                                value={userContext.getUser()?.email || ""}
                                                onChange={(e) =>
                                                    userContext.setUser({
                                                        ...userContext.getUser(),
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                    </tr>

                                    {/* Phone Number */}
                                    <tr>
                                        <th className="text-black pr-4">Phone Number:</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="w-full h-10 border border-gray-300 rounded-md px-4"
                                                value={userContext.getUser()?.phone_number || userContext.getUser()?.phoneNumber || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        userContext.setUser({
                                                            ...userContext.getUser(),
                                                            phone_number: value,
                                                        });
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>

                                    {/* Update a user password with a new password, in case they forgotten it. */}
                                    <tr>
                                        <th className="text-black pr-4">Enter a New Password:</th>
                                        <td className="relative">
                                            <input
                                                type={showEditUserPassword ? "text" : "password"}
                                                id="password"
                                                className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                                placeholder={"•••••••••"}
                                                autoComplete={"new-password"}
                                                min={8}
                                                max={20}
                                                onChange={(e) => setShowEditUserNewPassword(e.target.value)}
                                                required
                                            />
                                            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
                                                {showEditUserPassword ? (
                                                    <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowEditUserPassword(!showEditUserPassword)} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEye} onClick={() => setShowEditUserPassword(!showEditUserPassword)} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Boolean Fields */}
                                    {[
                                        { label: "Is Verified", key: "is_verified" },
                                        { label: "Is Active", key: "is_active" },
                                    ].map((field) => (
                                        <tr key={field.key}>
                                            <th className="text-black pr-4">{field.label}:</th>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={!!userContext.getUser()?.[field.key as keyof UserProps]}
                                                    onChange={(e) =>
                                                        userContext.setUser({
                                                            ...userContext.getUser(),
                                                            [field.key]: e.target.checked,
                                                        })
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Save Changes Button */}
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                onClick={() => {
                                    // Save changes logic here
                                    setToggleEditUser(false);
                                    editUserSubmit(userContext.getUser() as UserProps);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Overlay>
            }

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

                    {!heatmapData &&
                        <div className="w-full h-full flex justify-center items-center">
                            <div role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }
                </div>

                {/* CRUD Admin operations for non-existing users */}
                <div className="w-full h-fit">
                    <div className="p-2">
                        <h1 className="text-left font-bold text-black">Create User Accounts</h1>
                    </div>
                    <div className="w-full h-fit bg-gray-200 rounded shadow-md p-4 grid grid-rows-[auto_1fr_auto grid-cols-1 gap-4">
                        <form onSubmit={(e) => createNewUser(e, newAccount)}>
                            {/* Full Name and Phone Number */}
                            <div className="grid gap-6 mb-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="block mb-2 font-bold text-left">Full Name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John"
                                        onChange={(e) => setNewAccount({
                                            ...newAccount,
                                            fullName: e.target.value,
                                        })}
                                        pattern="[A-Za-z ]{1,}"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block mb-2 font-bold text-left">Phone number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="123-45-678"
                                        onChange={(e) => setNewAccount({
                                            ...newAccount,
                                            phoneNumber: e.target.value,
                                        })}
                                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* Email and Password */}
                                <div className="w-full h-full">
                                    <div className="mb-6">
                                        <label htmlFor="email" className="block mb-2 font-bold text-left">Email address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="john.doe@company.com"
                                            autoComplete="username"
                                            onChange={(e) => setNewAccount({
                                                ...newAccount,
                                                email: e.target.value,
                                            })}
                                            required />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="password" className="block mb-2 font-bold text-left">New password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                className={`${
                                                    !checkConfirmPassword || !newAccount?.password
                                                      ? "text-gray-800"
                                                      : checkConfirmPassword !== newAccount?.password
                                                      ? "text-red-500"
                                                      : "text-green-500"
                                                  } bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                                placeholder={"•••••••••"}
                                                autoComplete={"new-password"}
                                                min={8}
                                                max={20}
                                                onChange={(e) => setNewAccount({
                                                    ...newAccount,
                                                    password: e.target.value,
                                                })}
                                                required
                                            />
                                            <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400">
                                                {showPassword ? (
                                                    <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(!showPassword)} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(!showPassword)} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="confirm_password" className="block mb-2 font-bold text-left">Confirm password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirm_password"
                                                className={`${
                                                    !checkConfirmPassword || !newAccount?.password
                                                      ? "text-gray-800"
                                                      : checkConfirmPassword !== newAccount?.password
                                                      ? "text-red-500"
                                                      : "text-green-500"
                                                  } bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                                placeholder={"•••••••••"}
                                                autoComplete={"new-password"}
                                                min={8}
                                                max={20}
                                                onChange={(e) => {
                                                    setCheckConfirmPassword(e.target.value);
                                                }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                                            >
                                                {showConfirmPassword ? (
                                                    <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEye} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Roles */}
                                <div className="w-full h-full">
                                    <div className="mb-6">
                                        <label htmlFor="roleName" className="block mb-2 font-bold text-left">Role Name</label>
                                        <select
                                            id="roleName"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={newAccount?.roleId || ""}
                                            onChange={(e) => {
                                                setNewAccount({
                                                    ...newAccount,
                                                    roleId: getRoleIdFromName(e.target.value) || -1,
                                                });
                                            }}
                                        >
                                            <option value="" disabled>Select a role</option>
                                            {roles.map((role, index) => (
                                                <option key={index} value={role.roleName}>
                                                    {role.roleName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-6">
                                        <div className="mb-6">
                                            <button
                                                type="submit"
                                                className="w-full py-1 bg-gray-700 rounded text-white w-24 h-fit cursor-pointer hover:bg-gray-800"
                                            >
                                                    <span className="text-xs sm:text-xs md:text-md">Submit</span>
                                            </button>
                                        </div>

                                        <div className="h-full">
                                            {creationStatusMessage &&
                                                <h1 className="text-black font-bold">{creationStatusMessage}</h1>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
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
                                "is_verified",
                                "is_active",
                            ]
                        }
                    >
                        <></>
                    </PaginatedTable>
                }

                {!data && <div className="w-full h-full flex justify-center items-center"><p className="font-bold">No data to display</p></div>}
            </div>
        </>
    )
};

export default Recovery;