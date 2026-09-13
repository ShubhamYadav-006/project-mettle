import axios from 'axios';

// Support both standard VITE_API_URL and VITE_API_BASE_URL
const rawApiUrl = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).trim().replace(/\/+$/, '');

const apiBase = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true, // Send HTTP-only cookies across requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 20000,
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

// Response Interceptor for global error formatting & auth expiration cleanup
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mettle_token');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      } catch (e) {}
    }

    const message =
      (error.response && error.response.data && error.response.data.message) ||
      (error.code === 'ERR_NETWORK' ? 'Network error: Unable to connect to server.' : null) ||
      error.message ||
      'An unexpected error occurred';

    error.message = message;
    return Promise.reject(error);
  }
);

export { apiBase };
export default api;
