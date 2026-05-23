import axiosInstance from '../axiosInstance';

export const bookingService = {
  checkAvailability: (data) => axiosInstance.post('/bookings/check-availability', data),
  createBooking: (data) => axiosInstance.post('/bookings', data),
  getUserBookings: (params) => axiosInstance.get('/bookings', { params }),
  getBooking: (id) => axiosInstance.get(`/bookings/${id}`),
  cancelBooking: (id, data) => axiosInstance.put(`/bookings/${id}/cancel`, data),
};