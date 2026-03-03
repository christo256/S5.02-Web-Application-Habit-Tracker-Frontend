import axios from 'axios';

// URL base del backend
const API_URL = 'http://localhost:8080/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token JWT automáticamente
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log del error para debugging
    console.error('🔴 API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });

    // Solo redirigir a login si NO es una petición de auth
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth')) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ENDPOINTS ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ========== HABIT ENDPOINTS ==========
export const habitAPI = {
  getAll: () => api.get('/habits'),
  getById: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  complete: (id) => api.post(`/habits/${id}/complete`),
  getStats: () => api.get('/habits/stats'),
  getRankings: (frequency) => api.get(`/habits/rankings/${frequency}`),  // ← NUEVO
};

// ========== ADMIN ENDPOINTS ==========
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllHabits: () => api.get('/admin/habits'),
  getStats: () => api.get('/admin/stats'),
};

export default api;