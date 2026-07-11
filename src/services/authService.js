import api from './api';

export const authService = {
  login: async (credentials) => {
    // credentials should be { email, password }
    const response = await api.post('/auth/login', credentials);
    // Returning response directly so caller can verify role before setting token
    return response;
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
