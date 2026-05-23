import axiosInstance from '../axiosInstance';

export const paymentService = {
  createPaymentIntent: (data) => axiosInstance.post('/payments/create-intent', data),
  confirmPayment: (data) => axiosInstance.post('/payments/confirm', data),
  getPayment: (id) => axiosInstance.get(`/payments/${id}`),
  getUserPayments: (params) => axiosInstance.get('/payments', { params }),
};