import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PaginatedTable from "../../system-activity/network-activity/components/paginated-table";
import { Scrollbar } from "../../../../../components/scrollbar";
import { rolesResponse, usersResponse } from "../../../../../common/data";
import { useRoleContext } from "../../../../../common/contexts/role";
import { Permission, Role, TableRow, UserProps } from "../../../../../common/interfaces";
import Overlay from "../../../../../components/overlay";
import { useUserContext } from "../../../../../common/contexts/user";

/**
 * This component creates a series of permissible options to be assigned to a role.
 * It also ensures the person assigning such permissions also has the ability to.
 */
const PermissionsList: React.FC = () => {
    const roleContext = useRoleContext();

    const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
    const [dbPermissions, setDbPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        const fetchDbPermissions = () => {
            const dbPermissions =
                rolesResponse[0]
                    .permissions
                    .concat(rolesResponse[1].permissions)
                    .concat(rolesResponse[2].permissions);

            const rolePermissions: Permission[] = roleContext.permissions;
            return { rolePermissions, dbPermissions };
        };

        const { rolePermissions: newRolePermissions, dbPermissions: newDbPermissions } = fetchDbPermissions();
        setRolePermissions(newRolePermissions);
        setDbPermissions(newDbPermissions);
    }, [roleContext.roleId, roleContext.permissions]); // Re-run when roleId or permissions change

    const getUnassignedUserPermissions = () => {
        return dbPermissions.filter(permission => !rolePermissions.includes(permission));
    };

    const setUserPermission = (permission: Permission) => {
        if (dbPermissions.includes(permission)) {
            setDbPermissions(dbPermissions.filter(p => p !== permission));
            setRolePermissions([...rolePermissions, permission]);
            roleContext.addPermissions([...rolePermissions, permission]);
        } else if (rolePermissions.includes(permission)) {
            setRolePermissions(rolePermissions.filter(p => p !== permission));
            setDbPermissions([...dbPermissions, permission]);
            roleContext.addPermissions(rolePermissions.filter(p => p !== permission));
        }
    };

    const removeUserPermission = (permission: Permission) => {
        setRolePermissions(rolePermissions.filter(p => p !== permission));
        setDbPermissions([...dbPermissions, permission]);
        roleContext.addPermissions(rolePermissions.filter(p => p !== permission));
    };

    const nonBindedPermissions = getUnassignedUserPermissions();

    return (
        <div className="grid grid-cols-[0.5fr_auto_1fr] w-full h-full">

            {/* Existing Permissions */}
            <Scrollbar paddingLeft="0">
                <div className="w-full h-full pl-4 pt-4 pb-4">
                    <div className="flex flex-row justify-start items-center">
                        <h1 className="font-bold typography text-left">Permissions</h1>
                    </div>
                    <div className="h-[calc(50vh)]">
                            {rolePermissions.map((permission, index) => (
                                <div key={index} className="flex flex-row justify-between items-center hover:bg-gray-300 cursor-pointer">
                                    <h1 className="text-sm typography uppercase">{permission.name}</h1>

                                    {/* Remove the permission */}
                                    <div className="ml-4 mr-2 flex justify-center items-center">
                                        <FontAwesomeIcon
                                            icon={faXmark}
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => removeUserPermission(permission)}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </Scrollbar>

            <div className="h-full w-0.25 bg-gray-300"></div>

            {/* Permissions to add */}
            <div className="w-full h-full p-4">
                <div className="flex flex-row justify-start items-center">
                    <h1 className="font-bold typography text-left">Add Permissions</h1>
                </div>

                {nonBindedPermissions.map((permission, index) => (
                    <div key={index} className="flex flex-row justify-between hover:bg-gray-300 cursor-pointer">
                        <h1 className="text-sm typography uppercase flex">{permission.name}</h1>

                        {/* Add the permission */}
                        <div className="ml-4 mr-2">
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="text-green-500 cursor-pointer"
                                onClick={() => setUserPermission(permission)}
                            />
                        </div>
                    </div>
                ))
                }
            </div>
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
    const setClickedRole = (role: Role) => {
        roleContext.setRole(role);
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
    const [roles, setRoles] = useState<Role[]>([]);
    const [newRoleName, setNewRoleName] = useState<string>("");

    const [filteredTableHeads, setFilteredTableHeads] = useState<string[]>([]);
    const [filteredTableData, setFilteredTableData] = useState<UserProps[]>([]);

    const roleContext = useRoleContext();
    const userContext = useUserContext();

    async function fetchUser(userId: number) {

        // Replace with actual fetch request
        const foundUser = usersResponse.tbody.find(user => user.user_id === userId);
        if (foundUser) {
            userContext.setUser(foundUser as UserProps);
        }

        console.log("fetched user: ", foundUser);
    };

    useEffect(() => {
        const tableHeadsToExclude = ["is_verified", "phone_number", "is_active", "is_staff", "is_admin", "is_superuser"];

        // Filter the table heads
        const filteredHeads = usersResponse.thead.filter((head) => !tableHeadsToExclude.includes(head));
        setFilteredTableHeads(filteredHeads);

        // Filter the table data by excluding the unwanted columns
        const filteredData = usersResponse.tbody.map((row) => {
            const filteredRow: TableRow = {};
            for (const head of filteredHeads) {
                filteredRow[head] = row[head as keyof typeof row];
            }
            return filteredRow;
        });

        setFilteredTableData(filteredData);

        const fetchRoles = () => {
            return rolesResponse;
        };

        let fetchedRoles = fetchRoles();
        setRoles(fetchedRoles);
    }, []);

    /**
     * Creates a new role on the UI with no permissions, but
     * sends an update to the backend to create a new role.
     * @param e
     */
    const createNewRole = (e: React.FormEvent) => {
        e.preventDefault();

        if (newRoleName.length > 0 && newRoleName.trim()) {
            const newRole: Role = {
                roleId: roles.length + 1,
                roleName: newRoleName,
                permissions: [],
            };

            setRoles([...roles, newRole]);
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
        roleContext.removeRole(role);
        setRoles(roles.filter((r) => r.roleId !== role.roleId));
    };

    /**
     * Sets the clicked user id into context to manage
     * the user's attributes, specifically roles & perms.
     * @param userId
     */
    const onUserIdClick = (userId: number) => {
        console.log("onclicked user id: ", userId);

        // Fetch the user from the database
        // fetchUser(userId);
        const user = usersResponse.tbody.find(
            user => user.user_id === userId
        ) as UserProps;

        console.log("fetched user from onclicked user id: ", user);

        if (user) userContext.setUser(user);

    };

    /**
     * Updates the user's role in the database.
     */
    const updateUserRole = (e: React.FormEvent) => {
        e.preventDefault();

        // Replace with actual fetch request
        console.log("Updated user role: ", userContext.user);
    };

    return (
        <>
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
                    <div className="w-full flex flex-col py-4">
                        <Scrollbar paddingLeft="4">
                            <div className="">
                                <Roles roles={roles} onRemoveRole={handleRemoveRole} />
                            </div>
                        </Scrollbar>
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
                                <p className="typography font-bold">Select or create a role to edit permissions</p>
                            </div>
                        }

                        {roleContext.roleId && <PermissionsList />}
                    </div>
                </div>

                <div className="col-span-2 bg-gray-200 h-fit">
                    <div className="border-b border-gray-800 py-2 flex flex-row justify-between items-center">
                        <div className="px-4">
                            <h1 className="font-bold typography text-left">Assign a user permissions</h1>
                        </div>
                    </div>

                    <PaginatedTable
                        thead={filteredTableHeads}
                        tbody={filteredTableData as TableRow[]}
                        placeHolder="Search for a user..."
                        maxRowsPerPage={4}
                        onUserIdClick={(userId) => onUserIdClick(userId)}
                    >
                        <div className="w-full h-52 bg-white rounded grid grid-rows-[auto_1fr_auto]">
                            <div className="w-full flex justify-start items-center border-b pb-2 mb-4">
                                <h1 className="font-bold">Assign '{userContext.user?.userId}' a new role</h1>
                            </div>

                            <form className="w-full h-full flex flex-col justify-center space-y-4 px-4">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Role</th>
                                            <td>
                                                <select
                                                    className="w-full h-10 border border-gray-300 rounded-md px-4"
                                                    value={userContext.user?.roleId}
                                                    onChange={(e) => userContext.setUser({ ...userContext.user, roleId: parseInt(e.target.value) })}
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
                                    onClick={updateUserRole}
                                >
                                    <p className="text-center text-white bg-blue-500 hover:bg-blue-400 p-2 rounded-md">Assign Role</p>
                                </button>
                            </form>

                        </div>
                    </PaginatedTable>
                </div>
            </div>
        </>
    )
};

export default RolePermissions;