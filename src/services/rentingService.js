import api from './api';

export const rentingService = {
  // --- Customer Flow ---
  createBooking: async (payload) => {
    return await api.post('/rentals', payload);
  },

  getMyRentals: async (page = 0, size = 10) => {
    return await api.get('/rentals/my-rentals', { params: { page, size } });
  },

  getBookingDetail: async (id) => {
    return await api.get(`/rentals/${id}`);
  },

  payDeposit: async (id) => {
    return await api.patch(`/rentals/${id}/pay-deposit`);
  },

  payFull: async (id) => {
    return await api.patch(`/rentals/${id}/pay-full`);
  },

  cancelBooking: async (id) => {
    return await api.patch(`/rentals/${id}/cancel`);
  },

  // --- Admin Flow ---
  getAllRentals: async (page = 0, size = 10) => {
    return await api.get('/admin/rentals', { params: { page, size } });
  },

  getAdminBookingDetail: async (id) => {
    return await api.get(`/admin/rentals/${id}`);
  },

  approveBooking: async (id) => {
    return await api.patch(`/admin/rentals/${id}/approve`);
  },

  rejectBooking: async (id, adminNote) => {
    return await api.patch(`/admin/rentals/${id}/reject`, { adminNote });
  },

  handoverBooking: async (id) => {
    return await api.patch(`/admin/rentals/${id}/handover`);
  },

  receiveBooking: async (id) => {
    return await api.patch(`/admin/rentals/${id}/receive`);
  }
};
