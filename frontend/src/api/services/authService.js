import axiosInstance from '../axiosInstance';

export const authService = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, data) => axiosInstance.post(`/auth/reset-password/${token}`, data),
  refreshToken: (refreshToken) => axiosInstance.post('/auth/refresh-token', { refreshToken }),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),
};