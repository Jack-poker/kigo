import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for CSRF tokens
api.interceptors.request.use(async (config) => {
  if (config.method?.toUpperCase() === 'POST') {
    const { data } = await api.get('/get-csrf-token');
    config.headers['x-csrf-token'] = data.csrf_token;
    if (config.data) {
      config.data.csrf_token = data.csrf_token;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(error.response.data?.message || 'Invalid request');
          break;
        case 401:
          localStorage.clear();
          window.location.href = '/login';
          toast.error('Session expired');
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 429:
          toast.error('Too many requests, try again later');
          break;
        default:
          toast.error('Server error, contact support');
      }
    }
    return Promise.reject(error);
  }
);

export default api;