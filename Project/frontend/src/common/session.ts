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

/**
 * Decodes a JWT token without verifying its signature.
 * @param token - The JWT token to decode.
 * @returns The decoded payload as an object, or null if decoding fails.
 */
const decodeToken = (token: string): Record<string, unknown> | null => {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

/**
 * Returns true if the session is expired, false otherwise.
 * @returns {boolean} - True if the session is expired, false otherwise.
 */
const checkExpiredSession = (): boolean => {
    const accessToken = sessionStorage.getItem('access_token');

    if (accessToken === null) return true;

    const decodedToken = decodeToken(accessToken);
    if (decodedToken === null) return true;
    if (!decodedToken.exp) return true;
    if (typeof decodedToken.exp !== 'number') return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return  currentTime >= decodedToken.exp;
};



export {
    getTokenRefresh,
    getTokenAccess,
    removeTokens,
    decodeToken,
    checkExpiredSession
}