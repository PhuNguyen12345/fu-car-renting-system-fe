import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // You can handle global errors here like 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Optional: Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
