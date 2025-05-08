import axios from "axios";
import { JSONResponse, Permission, Role } from "../common/interfaces";
import { getTokenAccess } from "../common/session";


const permissions = axios.create({
    baseURL: "http://localhost:8000/api/permissions"
});

permissions.interceptors.request.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/';
        }
    }
);


const getRolePermissions = async (): Promise<JSONResponse<Role[]>> => {
    return permissions.get<JSONResponse<Role[]>>("/roles/",
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching role permissions:", error);
            throw error;
        });
}

const getPermissions = async (): Promise<JSONResponse<Permission[]>> => {
    return permissions.get<JSONResponse<Permission[]>>("/",
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching permissions:", error);
            throw error;
        });
}

/**
 * Add a new permission to an existing role in the system.
 * @param roleId - The ID of the role to which the permission will be added.
 * @param permission_name - The name of the permission to be added.
 * @returns {Promise<JSONResponse<Permission>>} - A promise that resolves to the added permission.
 */
const addPermission = async (roleId: number, permissionName: string): Promise<JSONResponse<Permission>> => {
    return permissions.put<JSONResponse<Permission>>(`/role/${roleId}/update/`, {
        "permission_name": permissionName,
        },
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error adding permission:", error);
            throw error;
        });
};

/**
 * Remove a permission from an existing role in the system.
 * @param roleId - The ID of the role from which the permission will be removed.
 * @param permissionName - The name of the permission to be removed.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the response message.
 */
const removePermission = async (roleId: number, permissionName: string): Promise<JSONResponse> => {
    return permissions.delete(`/role/${roleId}/delete/`, {
        data: {
            "permission_name": permissionName
        },
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
    .then((response) => {
        return {
            status: response.data.status,
            message: response.data.message,
            data: response.data.data
        } as JSONResponse;
    })
    .catch((error) => {
        console.error("Error removing permission:", error);
        throw error;
    });
};

/**
 * Get an array of permissions for a role ID.
 * @param roleId
 * @returns
 */
const getPermissionsOfRoleId = async (roleId: number): Promise<JSONResponse<Permission[]>> => {
    return permissions.get<JSONResponse<Permission[]>>(`/role/${roleId}/`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching permissions of role ID:", error);
            throw error;
        });
}

export {
    getRolePermissions,
    getPermissions,
    addPermission,
    removePermission,
    getPermissionsOfRoleId
}