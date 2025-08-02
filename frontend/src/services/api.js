import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios de Productos
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addMovement: (id, movement) => api.post(`/products/${id}/movement`, movement),
};

// Servicios de Categorías
export const categoriesAPI = {
  getAll: (params = {}) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Servicios de Movimientos
export const movementsAPI = {
  getAll: (params = {}) => api.get('/movements', { params }),
  getByProduct: (productId, params = {}) => api.get(`/movements/product/${productId}`, { params }),
  getToday: () => api.get('/movements/today'),
  getStats: () => api.get('/movements/stats'),
};

// Servicios del Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
  getWeeklyStats: () => api.get('/dashboard/stats/weekly'),
};

export default api; 