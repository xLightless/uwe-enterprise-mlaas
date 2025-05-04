import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PaginatedTable from "../../system-activity/network-activity/components/paginated-table";
import { Scrollbar } from "../../../../../components/scrollbar";
import { useRoleContext } from "../../../../../common/contexts/role";
import { Permission, Role, TableData, TableRow, UserProps } from "../../../../../common/interfaces";
import Overlay from "../../../../../components/overlay";
import { useUserContext } from "../../../../../common/contexts/user";
import { addPermission, getPermissions, getPermissionsOfRoleId, getRolePermissions, removePermission } from "../../../../../repositories/permissions";
import { createRole, deleteRole, getRole, getRoles } from "../../../../../repositories/roles";
import { adminUpdateUserDetails, getUsers } from "../../../../../repositories/user";

/**
 * This component creates a series of permissible options to be assigned to a role.
 * It also ensures the person assigning such permissions also has the ability to.
 */
const PermissionsList: React.FC = () => {
    const roleContext = useRoleContext();

    const [activePermissions, setActivePermissions] = useState<string[]>([]);
    const [addPermissions, setAddPermissions] = useState<string[]>([]);

    /**
     * Update a permission being transposed between the two lists.
     * @param permissionName - The name of the permission to be added.
     */
    const setRolePermission = (permissionName: string) => {
        const hasPermission = activePermissions.includes(permissionName);
        if (!hasPermission && roleContext.roleId) {
            setActivePermissions([...activePermissions, permissionName]);
            setAddPermissions(addPermissions.filter((p) => p !== permissionName));
            addPermission(roleContext.roleId, permissionName)
        }
    };

    /**
     * Remove a permission from the active list and add it to the available list.
     * @param permissionName - The name of the permission to be removed.
     */
    const removeRolePermission = (permissionName: string) => {
        const hasPermission = activePermissions.includes(permissionName);
        if (hasPermission && roleContext.roleId) {
            setActivePermissions(activePermissions.filter((p) => p !== permissionName));
            setAddPermissions([...addPermissions, permissionName]);
            removePermission(roleContext.roleId, permissionName)
        }
    };

    const getDatabasePermissions = async () => {
        const permissions = await getPermissions();
        return permissions;
    }

    useEffect(() => {
        const rolePermissions = roleContext.permissions.map((permission) => permission.permissionName);
        setActivePermissions(rolePermissions);

        const fetchDatabasePermissions = async () => {
            const dbPermissions = await getDatabasePermissions();
            const allPermissions = dbPermissions.data ? dbPermissions.data.permissions : [];
            const activePermsList = roleContext.permissions.map((permission) => permission.permissionName);
            const filteredDbPerms = allPermissions.filter((perm: string) => !activePermsList.includes(perm));

            setAddPermissions(filteredDbPerms);
        };
        fetchDatabasePermissions();
    }, [roleContext.permissions, roleContext.roleId, roleContext.roleName]); // Re-render when the role permissions change

    return (
        <div className="grid grid-cols-[0.5fr_auto_1fr] w-full h-full">
            {/* Existing Permissions */}
            <Scrollbar paddingLeft="0">
                <div className="w-full h-full pl-4 pt-4 pb-4">
                    <div className="flex flex-row justify-start items-center">
                        <h1 className="font-bold typography text-left">Permissions</h1>
                    </div>
                    <div className="h-[calc(50vh)]">
                        {activePermissions.map((permissionName, index) => (
                            <div key={index} className="flex flex-row justify-between items-center hover:bg-gray-300 cursor-pointer">
                                <h1 className="text-sm typography uppercase">{permissionName}</h1>

                                {/* Remove the permission */}
                                <div className="ml-4 mr-2 flex justify-center items-center">
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        className="text-red-500 cursor-pointer"
                                        onClick={() => removeRolePermission(permissionName)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Scrollbar>

            <div className="h-full w-0.25 bg-gray-300"></div>

            {/* Permissions to add */}
            <Scrollbar>
                <div className="w-full h-full p-4">
                    <div className="flex flex-row justify-start items-center">
                            <h1 className="font-bold typography text-left">Add Permissions</h1>
                        </div>

                    {addPermissions.map((permissionName, index) => (
                        <div key={index} className="flex flex-row justify-between hover:bg-gray-300 cursor-pointer">
                            <h1 className="text-sm typography uppercase">{permissionName}</h1>

                            {/* Add the permission */}
                            <div className="ml-4 mr-2">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="text-green-500 cursor-pointer"
                                    onClick={() => setRolePermission(permissionName)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Scrollbar>
        </div>
    )
};

interface RolesProps {
    roles: Role[];
    onRemoveRole: (role: Role) => void;
}

const Roles: React.FC<RolesProps> = ({ roles, onRemoveRole }) => {
    const roleContext = useRoleContext();

    // Set the clicked role as the active contextual role to manage.
    const setClickedRole = async (role: Role) => {
        const fetchedPermissionsArray = await getPermissionsOfRoleId(role.roleId as number);

        const permissionsMap = fetchedPermissionsArray.data.permissions.map(
            (permission: Permission) => {
                return {
                    permissionName: permission.permission_name,
                };
            }
        );
        console.log("Fetched permissions: ", permissionsMap);
        roleContext.setRole({
            roleId: role.roleId,
            roleName: role.roleName,
            permissions: permissionsMap,
        } as Role);
    };

    return (
        <ul className="w-full h-full">
            {roles.map((role, index) => (
                <li
                    key={index}
                    className="flex flex-row justify-between hover:bg-gray-300 cursor-pointer"
                    onClick={() => setClickedRole(role)}
                >
                    <h1 className="font-bold typography text-left">{role.roleName}</h1>

                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="text-red-500 cursor-pointer"
                            onClick={() => onRemoveRole(role)}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
};

const RolePermissions: React.FC = () => {
    const [toggleNewRoleCreation, setToggleNewRoleCreation] = useState(false);
    const [isUpdateRoleOpen, setUpdateRoleOpen] = useState(false);

    const [roles, setRoles] = useState<Role[]>([]);
    const [newRoleName, setNewRoleName] = useState<string>("");

    const [filteredTableHeads, setFilteredTableHeads] = useState<string[]>([]);
    const [filteredTableData, setFilteredTableData] = useState<TableData | null>(null);

    const filteredHeads = ["full_name", "email", "is_active", "role_name", "actions"];

    const roleContext = useRoleContext();
    const { setUser, getUser } = useUserContext();
    const [toggleEditUser, setToggleEditUser] = useState(false);

    const [hasTabledUpdated, setHasTableUpdated] = useState(false);

    function updateFilteredTableData(newData: TableData) {
        console.log("Updating filtered table data: ", newData);
        setFilteredTableData({
            thead: newData.thead,
            tbody: newData.tbody,
        } as TableData);
        setHasTableUpdated(!hasTabledUpdated);
    };

    // Opens the user settings editor for the selected user.
    const editUser = (user: TableRow) => {
        console.log("Editing user: ", user);
        setToggleEditUser(true);
        setUser({
            userId: user.user_id,
            roleId: user.role.role_id,
            fullName: user.full_name,
            email: user.email,
            phoneNumber: user.phone_number,
            isVerified: user.is_verified,
            isActive: user.is_active,
        } as UserProps);
    };

    const fetchRolesData = async () => {
        const fetchRolePermissions = async () => {
            const rolePermissionData = await getRolePermissions();
            return rolePermissionData;
        };

        const fetchedRolePermissions = await fetchRolePermissions();
        const fetchedRolePermissionsData = fetchedRolePermissions.data ? fetchedRolePermissions.data : [];

        const fetchedRoles = await getRoles();
        const fetchedRoleData = fetchedRoles.data ? fetchedRoles.data : [];
        const rolesData = fetchedRoleData.map((role: Role) => {
            const matchingRole = fetchedRolePermissionsData.find((r: Role) =>
                r.role_id === role.role_id
        );
            return {
                roleId: role.role_id,
                roleName: role.role_name,
                permissions: matchingRole
                    ? matchingRole.permissions.map((permission: Permission) => ({
                          permissionName: permission.permission_name,
                      }))
                    : [],
            };
        });
        console.log("Roles data: ", rolesData);
        setRoles(rolesData);
    }

    /**
     * Fetches all users from the database and updates the state
     * to populate, used to populate the paginated table subcomponent.
     */
    const fetchRoleUsers = async () => {
        const fetchedUsers = await getUsers();
        const users = fetchedUsers.data ? fetchedUsers.data : [];
        setFilteredTableHeads(filteredHeads);

        const filteredData = users.map((row: unknown) => {
            const filteredRow: TableRow = {};
            for (const head of filteredHeads) {
                if (head === "actions") {
                    filteredRow[head] = (
                        <div className="flex flex-row gap-2">
                            <button
                                className="hover:cursor-pointer bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                                onClick={() => editUser(row as TableRow)}
                            >
                                Edit
                            </button>
                        </div>
                    );
                }

                else if (head === "full_name") {
                    filteredRow[head] = row.full_name;
                } else if (head === "role_name") {
                    filteredRow[head] = row.role.role_name;
                } else if (head === "email") {
                    filteredRow[head] = row.email;
                }
                else if (head === "is_active") {
                    filteredRow[head] = row.is_active === true ? "True" : "False";
                } else {
                    filteredRow[head] = row[head];
                }

            }
            return filteredRow;
        });

        setFilteredTableData({
            thead: filteredHeads,
            tbody: filteredData,
        } as TableData);
    };

    /**
     * Creates a new role on the UI with no permissions, but
     * sends an update to the backend to create a new role.
     * @param e
     */
    const createNewRole = (e: React.FormEvent) => {
        e.preventDefault();

        if (newRoleName.length > 0 && newRoleName.trim()) {
            const newRole: Role = {
                // roleId: roles.length + 1,
                roleName: newRoleName,
                permissions: [],
            };

            // Send the new role to the backend
            createRole(newRole)

            // Render the new role on the UI
            setRoles([...roles, {...newRole, roleId: roles.length + 1}]);
            setNewRoleName("");
            setToggleNewRoleCreation(false);

        } else {
            console.error("Role name cannot be empty");
        }
    };

    /**
     * Removes all stateful information about a role,
     * then proceeds to delete it from the database.
     * @param role
     */
    const handleRemoveRole = (role: Role) => {
        if (role.roleId) {
            roleContext.removeRole(role);
            setRoles(roles.filter((r) => r.roleId !== role.roleId));

            deleteRole(role.roleId as number)
        } else {
            console.error("Role ID is not defined.");
        }
    };

    /**
     * Updates the user's role in the database.
     */
    const updateCurrentUserRole = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentUser = getUser();
        const selectedRoleId = (document.getElementById("roleName") as HTMLSelectElement)?.value;
        if (
            !currentUser ||
            !currentUser.userId ||
            selectedRoleId.length == 0 ||
            Number(selectedRoleId) <= 0
        ) return;

        /**
         * Gets the modified user object from the clicked state, then
         * updates the user's role ID in the database, followed by
         * re-rendering the new role name of the ID on the interface.
         */
        const userId = currentUser?.userId
        delete currentUser['userId'];
        const updatedUser: UserProps = {
            ...currentUser,
            roleId: Number(selectedRoleId),
        }
        const updatedUserDetails = await adminUpdateUserDetails(userId, updatedUser)
        const fetchedUserRole = await getRole(updatedUserDetails.data.role_id)
        const updatedUserRoleData = fetchedUserRole.data ? fetchedUserRole.data : null;
        if (updatedUserRoleData && updatedUserDetails.status === 200) {
            const updatedUserRole = {
                roleId: updatedUserRoleData.role_id,
                roleName: updatedUserRoleData.role_name
            } as Role;

            setUpdateRoleOpen(false);
            updateFilteredTableData({
                thead: filteredHeads,
                tbody: filteredTableData?.tbody.map((row) =>
                    row.user_id === userId
                        ? {
                              ...row,
                              role_name: updatedUserRole.roleName,
                          }
                        : row
                ) || [],
            });

            console.log("Updated filter current user role: ", filteredTableData);
        }
    };

    useEffect(() => {
        fetchRoleUsers();
        fetchRolesData();

    }, [hasTabledUpdated]);

    return (
        <>
            {toggleEditUser &&
                <Overlay onClose={() => setToggleEditUser(false)}>
                    <div className="w-full h-fit bg-white rounded grid grid-rows-[auto_1fr_auto] p-4">
                        <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                            <h1 className="font-bold">User ID Information</h1>
                        </div>

                        <div className="grid grid-cols-1 h-36">
                            <table className="">
                                <tbody className="text-left">
                                    <tr className="w-fit">
                                        <th className="text-black">Full Name:</th>
                                        <td>{getUser()?.fullName}</td>
                                    </tr>
                                    <tr className="text-black">
                                        <th><label htmlFor="roleName" className="font-bold">Role Name: </label></th>
                                        <td>
                                            <select
                                                id="roleName"
                                                className="w-full h-10 border border-gray-300 rounded-md px-4"
                                                onChange={(e) => setUser({ ...getUser(), roleId: parseInt(e.target.value) })}
                                                value={getUser()?.roleId || ""}
                                            >
                                                {roles.map((role, index) => (
                                                        <option key={index} value={role.roleId}>
                                                            {role.roleName}
                                                        </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    updateCurrentUserRole(e);
                                    setToggleEditUser(false);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Overlay>
            }

            {toggleNewRoleCreation &&
                <Overlay onClose={() => setToggleNewRoleCreation(false)}>
                    <div className="mx-auto max-w-7xl bg-white rounded-md shadow p-4 h-fit space-y-4">
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="font-bold typography text-left">Create a new role</h1>
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="text-red-500 cursor-pointer"
                                onClick={() => setToggleNewRoleCreation(false)}
                            />
                        </div>

                        <div className="w-full h-full">
                            <form
                                className="w-full h-full"
                                onSubmit={createNewRole}>
                                <div className="w-full h-full flex flex-col space-y-4">
                                    <div className="w-full h-full flex flex-col">
                                        <label className="typography text-left">Role Name</label>
                                        <input
                                            type="text"
                                            value={newRoleName}
                                            className="w-full h-10 border border-gray-300 rounded-md px-4"
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                            minLength={5}
                                        />
                                    </div>

                                    <div className="w-full h-full flex flex-col">
                                        <button type="submit" className="cursor-pointer">
                                            <p className="text-center text-white bg-blue-500 hover:bg-blue-400 p-2 rounded-md">Create Role</p>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Overlay>
            }

            <div className="grid grid-cols-[0.25fr_1fr] grid-rows-[0.5fr_auto] w-full gap-4">
                <div className="bg-gray-200 rounded shadow-md">
                    <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                        <div className="px-4">
                            <h1 className="font-bold typography text-left">Roles</h1>
                        </div>
                        <div className="px-4">
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="text-gray-800 cursor-pointer text-lg"
                                onClick={toggleNewRoleCreation ? () => setToggleNewRoleCreation(false) : () => setToggleNewRoleCreation(true)}
                            />
                        </div>
                    </div>

                    {/* List of established roles */}
                    <div className={`w-full flex flex-col ${roles.length === 0 ? "h-[calc(100%-45px)]" : "py-4"}`}>
                        {roles &&
                            <Scrollbar paddingLeft="4">
                                <div className="">
                                    <Roles roles={roles} onRemoveRole={handleRemoveRole} />
                                </div>
                            </Scrollbar>
                        }

                        {roles.length === 0 &&
                            <div className="w-full h-full flex justify-center items-center">
                                <p className="typography font-bold">No roles found.</p>
                            </div>
                        }
                    </div>
                </div>

                <div className="bg-gray-200 rounded shadow-md">
                    <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                        <div className="px-4">
                            <h1 className="font-bold typography text-left">
                                {roleContext.roleId ? `Editing '${roleContext.roleName}' Permissions` : "Permissions"}
                            </h1>
                        </div>
                    </div>

                    {/* List of established roles */}
                    <div className="w-full h-[calc(50vh)] flex flex-col">
                        {!roleContext.roleId &&
                            <div className="w-full h-full flex justify-center items-center">
                                <p className="typography font-bold">{filteredTableData ? `Select or create a role to edit permissions` : `No permission data found.`}</p>
                            </div>
                        }

                        {roleContext.roleId && <PermissionsList />}
                    </div>
                </div>

                <div className={`col-span-2 bg-gray-200 ${filteredTableData ? "h-fit" : "h-full"}`}>
                    <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                        <div className="px-4">
                            <h1 className="font-bold typography text-left">Assign a user permissions</h1>
                        </div>
                    </div>

                {filteredTableData &&
                    <PaginatedTable
                        thead={filteredTableHeads}
                        tbody={filteredTableData?.tbody as TableRow[]}
                        placeHolder="Search for a user..."
                        maxRowsPerPage={4}

                        onCloseValue={isUpdateRoleOpen}
                        onClose={() => setUpdateRoleOpen(false)}

                        onNextPageEvent={() => {}}
                        onPreviousPageEvent={() => {}}
                        disableNextLastPage={true}
                        disablePreviousFirstPage={true}
                    >
                        {isUpdateRoleOpen &&
                            <div className="w-full h-52 bg-white rounded grid grid-rows-[auto_1fr_auto]">
                                <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                                    <h1 className="font-bold">Updating the role of {`${getUser()?.email}`}</h1>
                                </div>

                                <form className="w-full h-full flex flex-col justify-center space-y-4 px-4">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Role</th>
                                                <td>
                                                    <select
                                                        className="w-full h-10 border border-gray-300 rounded-md px-4"
                                                        value={getUser()?.roleId}
                                                        onChange={(e) => setUser({ ...getUser(), roleId: parseInt(e.target.value) })}
                                                    >
                                                        {roles.map((role, index) => (
                                                            <option key={index} value={role.roleId}>{role.roleName}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <button
                                        type="submit"
                                        className="cursor-pointer"
                                        onClick={(e) => updateCurrentUserRole(e)}
                                    >
                                        <p className="text-center text-white bg-blue-500 hover:bg-blue-400 p-2 rounded-md">Assign Role</p>
                                    </button>
                                </form>
                            </div>
                        }
                    </PaginatedTable>
                }

                {!filteredTableData &&
                    <div className="w-full h-full flex justify-center items-center">
                        <p className="font-bold">No data to display.</p>
                    </div>
                }
                </div>
            </div>
        </>
    )
};

export default RolePermissions;