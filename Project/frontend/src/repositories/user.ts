import axios from 'axios';
import { APIUsersProps, JSONResponse, mapGetUserFromSession, Permission, SessionContextProps, UserMeProps, UserProps } from '../common/interfaces';
import { getTokenAccess } from '../common/session';
import { getPermissionsOfRoleId } from './permissions';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/users',
})

axiosInstance.interceptors.request.use(
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

const updateUserDetails = async (updateData: { [key: string]: string }) => {
    try {
        const token = sessionStorage.getItem('access_token');

        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await axiosInstance.put('/me/update/', updateData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to update user details:', error);

        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }

        throw { error: 'Failed to update user details' };
    }
};

/**
 * Admin update user details.
 * @param user {UserProps} - The user object containing the details to update.
 */
const adminUpdateUserDetails = async (userId: number, user: UserProps) => {
    const editUserData = {
        email: user.email,
        full_name: user.fullName,
        role_id: user.roleId,
        phone_number: user.phoneNumber,
        is_verified: user.isVerified,
        is_active: user.isActive,
        password: user.password,
    }

    const filteredData = Object.fromEntries(
        Object.entries(editUserData).filter(
            ([, value]) => value !== undefined && value !== null
        )
    );

    return axiosInstance.put<JSONResponse>(
        `/${userId}/update/`,
        {
            ...filteredData,
        },
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    );
};

/**
 * Get information about a user by their ID.
 * @param userId - The ID of the user.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the user's information.
 */
const getUserDetails = async (userId: number): Promise<JSONResponse<UserProps>> => {
    return axiosInstance.get<JSONResponse<UserProps>>(`/${userId}/`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching user details:', error);
            throw error;
        });
};

/**
 * Get a list of all users.

 * @returns {Promise<JSONResponse>} - A promise that resolves to the list of users.
 */
const getUsers = async (): Promise<JSONResponse<APIUsersProps[]>> => {
    return axiosInstance.get<JSONResponse<APIUsersProps[]>>('/',
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error;
        });
};

const deleteUserById = async (userId: number): Promise<JSONResponse> => {
    return axiosInstance.delete<JSONResponse>(`/${userId}/delete/`,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then(response => response.data)
        .catch(error => {
            console.error('Error deleting user:', error);
            throw error;
        });
};

/**
 * Admin create a new user in the system.
 * @param user {UserProps} - The user object containing the details of the new user.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the created user's information.
 */
const createUser = async (user: UserProps): Promise<JSONResponse<UserProps>> => {
    return axiosInstance.post<JSONResponse<UserProps>>('/recovery/create-user/', user,
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating user:', error);
            throw error;
        });
};

/**
 * Get the current user's basic information:
 * - User ID
 * - Role ID, Role Name, and Permissions.
 * @returns {Promise<JSONResponse>} - A promise that resolves to the user's information.?
 */
const getUserFromSession = async (): Promise<JSONResponse> => {
    return axiosInstance.get<JSONResponse>('/me/',
        {
            headers: {
                Authorization: getTokenAccess(true),
            },
        }
    )
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching user from session:', error);
            throw error;
        });
}

const getUserSessionContext = async (): Promise<JSONResponse<SessionContextProps>> => {
    const me = await getUserFromSession();
    const user = mapGetUserFromSession(me as unknown as Record<string, unknown | Record<string, unknown>>) as UserMeProps;

    const fetchedPermissionsArray = await getPermissionsOfRoleId(user.role.roleId as number);
    const permissionsMap = fetchedPermissionsArray.data?.permissions?.map(
        (permission: Permission) => {
            return {
                permissionName: permission.permission_name,
            };
        }
    ) || [];

    return {
        status: 'success',
        message: 'User session context retrieved successfully',
        data: {
            userId: user.userId,
            role: {
                roleId: user.role.roleId,
                roleName: user.role.roleName,
                permissions: permissionsMap,
            },
        } as SessionContextProps,
    };
}




export {
    updateUserDetails,
    getUserDetails,
    getUsers,
    adminUpdateUserDetails,
    deleteUserById,
    createUser,
    getUserFromSession,
    getUserSessionContext
}