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
        const response = await apiClient.post('/api/users', user);
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

export const getUsersApi = async () => {
    try {
        const response = await apiClient.get('/api/users');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deleteUserApi = async (id) => {
    try {
        const response = await apiClient.delete(`/api/users/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
export const getUserDetailsApi = async (userId) => {
    try {
        const response = await apiClient.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateUserApi = async ({ userId, name, email, isAdmin }) => {
    try {
        const response = await apiClient.put(`/api/users/${userId}`, { name, email, isAdmin });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};






