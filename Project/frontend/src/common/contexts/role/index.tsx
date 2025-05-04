import React, { createContext, ReactNode, useContext, useState } from "react";
import { Permission, Role } from "../../interfaces";

interface RoleContextProps {
    roleId: number | null;
    roleName: string | null;
    permissions: Permission[];
    setRole: (role: Role) => void;
    removeRole: () => void;
    addPermissions: (permissions: Permission[]) => void;
};

const RoleContext = createContext<RoleContextProps>({
    roleId: null,
    roleName: null,
    permissions: [],
    setRole: () => {},
    removeRole: () => {},
    addPermissions: () => {}
});

const RoleProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [roleId, setRoleId] = useState<number | null>(null);
    const [roleName, setRoleName] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<Permission[]>([]);


    /**
     * Sets a new role with the given
     * roleId, roleName, and permissions in the context.
     */
    const setRole = (role: Role) => {

        // TODO: Get the role from the database

        // TODO: If the role is not found, attempt to create it.

        // TODO: Set the role in the context
        setRoleId(role.roleId);
        setRoleName(role.roleName);
        setPermissions(role.permissions);
    };

    /**
     * Removes the role from context, if applicable, and the database.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const removeRole = () => {
        // TODO: Remove the role from the database

        // TODO: Remove the role from the context
        setRoleId(null);
        setRoleName(null);
        setPermissions([]);
    };

    const addPermissions = (permissions: Permission[]) => {
        setPermissions(permissions);

        // TODO: Add the new permission to the permissions table, if not already there.

    };

    return (
        <RoleContext.Provider
            value={{
                roleId,
                roleName,
                permissions,
                setRole,
                removeRole,
                addPermissions
        }}>
            {children}
        </RoleContext.Provider>
    )
}

const useRoleContext = () => {
    const context = useContext(RoleContext);
    if (context === undefined) {
      throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export { RoleProvider, useRoleContext };
