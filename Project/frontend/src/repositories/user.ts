import axios from 'axios';
import { APIUsersProps, JSONResponse, UserProps } from '../common/interfaces';
import { getTokenAccess } from '../common/session';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/users',
})

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
    const filteredData = Object.fromEntries(
        Object.entries(user).filter(
            ([, value]) => value !== undefined && value !== null
        )
    );

    return axiosInstance.put<JSONResponse<UserProps>>(
        `/${userId.toString()}/update/`,
        {
            email: filteredData.email,
            full_name: filteredData.fullName,
            role_id: filteredData.roleId,
            phone_number: filteredData.phoneNumber,
            is_verified: filteredData.isVerified,
            is_active: filteredData.isActive,

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

export {
    updateUserDetails,
    getUserDetails,
    getUsers,
    adminUpdateUserDetails
}