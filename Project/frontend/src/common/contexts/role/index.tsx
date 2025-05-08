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
    roleName: "",
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
        if (!role.roleId) {
            console.error("Invalid role object passed to setRole:", role);
            return;
        }
        setRoleId(role.roleId);
        setRoleName(role.roleName);
        setPermissions(role.permissions);
    };

    /**
     * Removes the role from context, if applicable, and the database.
     */
    const removeRole = () => {
        setRoleId(null);
        setRoleName(null);
        setPermissions([]);
    };

    const addPermissions = (permissions: Permission[]) => {
        setPermissions(permissions);
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