import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = 'https://api.kaascan.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add admin token if available
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    
    // Add CSRF token if available
    const csrfToken = sessionStorage.getItem('lastCsrfToken');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle CSRF token errors
    if (error.response?.status === 403 && 
        error.response?.data?.detail?.includes('CSRF') && 
        !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get a fresh CSRF token
        const response = await axios.get(`${API_BASE_URL}/admin/get-csrf-token`, {
          withCredentials: true,
        });
        
        if (response.data && response.data.csrf_token) {
          const newToken = response.data.csrf_token;
          sessionStorage.setItem('lastCsrfToken', newToken);
          sessionStorage.setItem('csrfTokenTimestamp', Date.now().toString());
          
          // Update the failed request with new token and retry
          if (originalRequest.headers) {
            originalRequest.headers['X-CSRF-Token'] = newToken;
          }
          
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh CSRF token:', refreshError);
      }
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear admin token and redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await api.get('/admin/get-csrf-token');
    const token = response.data.csrf_token;
    
    if (token) {
      sessionStorage.setItem('lastCsrfToken', token);
      sessionStorage.setItem('csrfTokenTimestamp', Date.now().toString());
    }
    
    return token;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    
    // Try to use cached token if available
    const cachedToken = sessionStorage.getItem('lastCsrfToken');
    if (cachedToken) return cachedToken;
    
    throw error;
  }
};

export default api;