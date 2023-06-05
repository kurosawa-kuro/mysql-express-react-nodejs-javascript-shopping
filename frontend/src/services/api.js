// frontend\src\services\api.js

import { getApiClient } from './apiClient';

const apiClient = getApiClient();

// Helper function to handle errors
const handleApiError = (error) => {
    if (error && error.response) {
        throw new Error(error.response.data.message);
    }
    throw error;
}

export const registerUserApi = async (user) => {
    try {
        const response = await apiClient.post('/api/users/register', user);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

export const loginUserApi = async (credentials) => {
    try {
        const response = await apiClient.post('/api/users/auth', credentials);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchUserProfileApi = async () => {
    try {
        const response = await apiClient.get('/api/users/profile');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUserProfileApi = async (user) => {
    try {
        const response = await apiClient.put('/api/users/profile', user);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const logoutUserApi = async () => {
    try {
        const response = await apiClient.post('/api/users/logout');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
