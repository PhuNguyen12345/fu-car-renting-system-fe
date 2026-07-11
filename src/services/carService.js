import api from './api';

export const carService = {
  // --- Public Cars ---
  getPublicCars: async (params) => {
    return await api.get('/public/cars', { params });
  },

  getPublicCarDetail: async (id) => {
    return await api.get(`/public/cars/${id}`);
  },

  // --- Admin Cars ---
  // --- Admin Cars ---
  getAdminCars: async (params) => {
    return await api.get('/admin/cars', { params });
  },

  getAdminCarDetail: async (id) => {
    return await api.get(`/admin/cars/${id}`);
  },

  createCar: async (data) => {
    return await api.post('/admin/cars', data);
  },

  updateCar: async (id, data) => {
    return await api.patch(`/admin/cars/${id}`, data);
  },

  deleteCar: async (id) => {
    return await api.delete(`/admin/cars/${id}`);
  },

  restoreCar: async (id) => {
    return await api.post(`/admin/cars/${id}/restore`);
  },

  changeCarStatus: async (id, status) => {
    return await api.patch(`/admin/cars/${id}/status`, { status });
  },

  getCloudinarySignature: async () => {
    return await api.get('/admin/cars/cloudinary-signature');
  },

  // --- Locations & Brands ---
  getLocations: async () => {
    return await api.get('/public/locations');
  },

  getBrands: async () => {
    return await api.get('/public/brands');
  },

  // --- Admin Brands ---
  getAdminBrands: async () => {
    return await api.get('/admin/brands');
  },
  createBrand: async (data) => {
    return await api.post('/admin/brands', data);
  },
  updateBrand: async (id, data) => {
    return await api.patch(`/admin/brands/${id}`, data);
  },
  deleteBrand: async (id) => {
    return await api.delete(`/admin/brands/${id}`);
  },

  // --- Admin Locations ---
  getAdminLocations: async () => {
    return await api.get('/admin/locations');
  },
  createLocation: async (data) => {
    return await api.post('/admin/locations', data);
  },
  updateLocation: async (id, data) => {
    return await api.patch(`/admin/locations/${id}`, data);
  },
  deleteLocation: async (id) => {
    return await api.delete(`/admin/locations/${id}`);
  }
};
