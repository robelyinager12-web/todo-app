import axiosInstance from './axiosInstance';

export const registerUser = (data) => axiosInstance.post('/auth/register', data);

export const loginUser = (data) => axiosInstance.post('/auth/login', data);

export const logoutUser = () => axiosInstance.post('/auth/logout');

export const forgotPassword = (data) => axiosInstance.post('/auth/forgot-password', data);

export const resetPassword = (data) => axiosInstance.post('/auth/reset-password', data);