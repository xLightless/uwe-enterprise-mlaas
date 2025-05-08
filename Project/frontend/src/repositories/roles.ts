/**
 * Roles and Permissions
 */

import axios from "axios";
import { Role, JSONResponse } from "../common/interfaces";
import { getTokenAccess } from "../common/session";

const roles = axios.create({
    baseURL: "http://localhost:8000/api/roles"
});

roles.interceptors.request.use(
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

/**
 * Creates a new role in the system.
 * @param role - The role to be created.
 * @returns {Promise<JSONResponse<Role>>} - A promise that resolves to the created role.
 */
const createRole = async (role: Role): Promise<JSONResponse<Role>> => {
    console.log("Creating role:", role);
    return roles.post<JSONResponse<Role>>("/add/", {
        role_name: role.roleName,
    },
    {
        headers: {
            Authorization: getTokenAccess(true),
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error creating role:", error);
            throw error;
    });
}

/**
 * Delete an existing role in the system by its ID.
 * @param roleId - The ID of the role to be deleted.
 * @returns {Promise<JSONResponse<Role>>} - A promise that resolves to the deleted role.
 */
const deleteRole = async (roleId: number): Promise<JSONResponse<Role>> => {
    return roles.delete<JSONResponse<Role>>(`/delete/${roleId}`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error deleting role:", error);
            throw error;
        });

};

/**
 * Get all roles in the system.
 * @returns {Promise<JSONResponse<Role[]>>} - A promise that resolves to the list of roles.
 */
const getRoles = async (): Promise<JSONResponse<Role[]>> => {
    return roles.get<JSONResponse<Role[]>>("/",
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching roles:", error);
            throw error;
        });
}

/**
 * Retrieve information about a specific role by its ID.
 * @param roleId - The ID of the role to be fetched.
 * @returns {Promise<JSONResponse<Role>>} - A promise that resolves to the role information.
 */
const getRole = async (roleId: number): Promise<JSONResponse<Role>> => {
    return roles.get<JSONResponse<Role>>(`/${roleId}`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching role:", error);
            throw error;
        });
};

export {
    createRole,
    getRoles,
    getRole,
    deleteRole
}