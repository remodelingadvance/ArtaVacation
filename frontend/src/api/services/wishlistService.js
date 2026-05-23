import axiosInstance from '../axiosInstance';

export const wishlistService = {
  getWishlist: () => axiosInstance.get('/wishlist'),
  addToWishlist: (propertyId) => axiosInstance.post('/wishlist/add', { propertyId }),
  removeFromWishlist: (propertyId) => axiosInstance.post('/wishlist/remove', { propertyId }),
  isInWishlist: (propertyId) => axiosInstance.get(`/wishlist/check/${propertyId}`),
};