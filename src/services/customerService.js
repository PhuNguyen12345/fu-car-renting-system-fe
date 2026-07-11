import api from './api';

export const customerService = {
  getMyProfile: async () => {
    return await api.get('/customers/me');
  },
  
  updateMyProfile: async (profileData) => {
    return await api.put('/customers/me', profileData);
  },

  getCloudinarySignature: async () => {
    return await api.get('/customers/cloudinary-signature');
  },

  // --- Admin Customers ---
  getAdminCustomers: async () => {
    return await api.get('/admin/customers');
  },
  
  banCustomer: async (id) => {
    return await api.patch(`/admin/customers/${id}/ban`);
  },
  
  restoreCustomer: async (id) => {
    return await api.patch(`/admin/customers/${id}/restore`);
  }
};
