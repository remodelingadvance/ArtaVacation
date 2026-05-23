import axiosInstance from '../axiosInstance';

export const reviewService = {
  createReview: (data) => axiosInstance.post('/reviews', data),
  getPropertyReviews: (id, params) => axiosInstance.get(`/reviews/property/${id}`, { params }),
  updateReview: (id, data) => axiosInstance.put(`/reviews/${id}`, data),
  deleteReview: (id) => axiosInstance.delete(`/reviews/${id}`),
};