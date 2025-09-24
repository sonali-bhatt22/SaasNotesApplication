import axios from 'axios';

const baseURL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? '/api' // dev via Vite proxy
  : (import.meta.env.VITE_API_URL || '/api'); // prod hits backend URL

// Create axios instance with automatic token management
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password }); // <- remove /api
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => !!localStorage.getItem('authToken'),
};

// Notes API
export const notesAPI = {
  getNotes: () => api.get('/notes'),
  getNoteById: (id) => api.get(`/notes/${id}`),
  createNote: (noteData) => api.post('/notes', noteData),
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

// Tenant API
export const tenantAPI = {
  getTenant: (slug) => api.get(`/tenants/${slug}`),
  upgradePlan: (slug) => api.post(`/tenants/${slug}/upgrade`),
};


export default api;
