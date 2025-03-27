import axios from 'axios'

const API_URL = 'http://localhost:8000/api/auth'

export const registerUser = async (userData: {
    email: string
    password: string
    password2: string
    full_name: string
    phone_number: string
}) => {
    try {
        const response = await axios.post(`${API_URL}/register/`, userData)

        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const verifyOtp = async (otpData: {
    phone_number: string
    otp: string
}) => {
    try {
        const response = await axios.post(`${API_URL}/verify/`, otpData)

        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const loginUser = async (userData: {
    email: string
    password: string
}) => {
    try {
        const response = await axios.post(`${API_URL}/login/`, userData)

        return response.data
    } catch (error) {
        throw error.response.data
    }
}