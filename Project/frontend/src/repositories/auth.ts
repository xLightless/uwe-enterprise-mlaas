import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
})

axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken()

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)

                sessionStorage.removeItem('access_token')
                sessionStorage.removeItem('refresh_token')

                window.location.href = '/'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export const registerUser = async (userData: {
    email: string
    password: string
    password2: string
    full_name: string
    phone_number: string
}) => {
    try {
        const response = await axiosInstance.post('/register/', userData)

        return response.data
    } catch (error) {
        throw (error as any).response.data
    }
}

export const verifyOtp = async (otpData: {
    phone_number: string
    otp: string
}) => {
    try {
        const response = await axiosInstance.post('/verify/', otpData)

        sessionStorage.setItem('access_token', response.data.access)
        sessionStorage.setItem('refresh_token', response.data.refresh)

        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data
        }

        throw { error: 'An unknown error occurred' }
    }
}

export const loginUser = async (userData: {
    email: string
    password: string
}) => {
    try {
        const response = await axiosInstance.post('/login/', userData)

        sessionStorage.setItem('access_token', response.data.access)
        sessionStorage.setItem('refresh_token', response.data.refresh)

        return response.data
    } catch (error) {
        console.error('Login failed:', error)

        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }

        throw { error: 'Login failed' };
    }
}

export const handleLogoutUser = async () => {
    try {
        const refreshToken = sessionStorage.getItem('refresh_token')

        if (!refreshToken) {
            throw new Error('Refresh token not found')
        }

        const response = await axiosInstance.post('/logout/', { refresh: refreshToken })

        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')

        return response.data
    } catch (error) {
        console.error('Logout failed:', error)

        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }

        throw { error: 'Logout failed' };
    }
}

export const fetchUserSettings = async () => {
    try {
        const response = await axiosInstance.get('/profile/')

        return response.data
    } catch (error) {
        console.error('Failed to fetch user settings:', error)

        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data
        }

        throw { error: 'Failed to fetch user settings' }
    }
}

export const refreshAccessToken = async () => {
    try {
        const refreshToken = sessionStorage.getItem('refresh_token')

        if (!refreshToken) {
            throw new Error('Refresh token not found')
        }

        const response = await axios.post('http://localhost:8000/api/auth/refresh/', { refresh: refreshToken })

        sessionStorage.setItem('access_token', response.data.access)

        if (response.data.refresh) {
            sessionStorage.setItem('refresh_token', response.data.refresh);
        }

        return response.data.access
    } catch (error) {
        console.error('Failed to refresh access token:', error)

        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')

        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        
        throw { error: 'Failed to refresh access token' };
    }
}