/**
 * This module contains different functions to simplifying the frontend
 * token handling.
 */

const getTokenRefresh = () => {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('Refresh token not found');
    }
};

const getTokenAccess = (header: boolean) => {
    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('Access token not found');
    }
    return header ? `Bearer ${accessToken}` : accessToken;
};

const removeTokens = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
};


export {
    getTokenRefresh,
    getTokenAccess,
    removeTokens
}