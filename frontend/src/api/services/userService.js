import axiosInstance from '../axiosInstance';

export const userService = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  changePassword: (data) => axiosInstance.put('/users/change-password', data),
  getNotifications: () => axiosInstance.get('/users/notifications'),
  markNotificationAsRead: (notificationId) => axiosInstance.put('/users/notifications', { notificationId }),
  deleteAccount: (password) => axiosInstance.delete('/users/account', { data: { password } }),
};