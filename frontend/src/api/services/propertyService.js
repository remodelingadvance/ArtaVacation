import axiosInstance from '../axiosInstance';

export const propertyService = {
  getAllProperties: (params) => axiosInstance.get('/properties', { params }),
  getProperty: (id) => axiosInstance.get(`/properties/${id}`),
  getFeaturedProperties: () => axiosInstance.get('/properties/featured'),
  getPropertiesByType: (type, params) => axiosInstance.get(`/properties/type/${type}`, { params }),
  getSimilarProperties: (id) => axiosInstance.get(`/properties/similar/${id}`),
  createProperty: (data) => axiosInstance.post('/properties', data),
  updateProperty: (id, data) => axiosInstance.put(`/properties/${id}`, data),
  deleteProperty: (id) => axiosInstance.delete(`/properties/${id}`),
  deletePropertyImage: (id, imageId) => axiosInstance.delete(`/properties/image/${id}/${imageId}`),
  getOwnerProperties: (params) => axiosInstance.get('/properties/owner/properties', { params }),
};