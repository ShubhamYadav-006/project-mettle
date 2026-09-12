import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HTTP-only cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Authorization Bearer token as fallback
api.interceptors.request.use(
  (config) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('mettle_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore localStorage read errors in restricted contexts
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
