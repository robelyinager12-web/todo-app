import axiosInstance from './axiosInstance';

export const getProfile = () => axiosInstance.get('/users/profile');

export const updateProfile = (data) => axiosInstance.put('/users/profile', data);

export const changePassword = (data) => axiosInstance.put('/users/change-password', data);

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return axiosInstance.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};