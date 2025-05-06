import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/users',
})

export const updateUserDetails = async (updateData: { [key: string]: string }) => {
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