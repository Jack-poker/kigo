import axios from 'axios';

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000'


// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Function to get CSRF token
const getCsrfToken = async () => {
  const response = await api.get('/auth/csrf-token');
  return response.data.csrfToken;
};

// Register new user
export const register = async (userData: {
  phone: string;
  username: string;
  password: string;
  securityPin: string;
}) => {
  try {
    // Get CSRF token first
    const csrfToken = await getCsrfToken();
    
    // Make registration request with CSRF token
    const response = await api.post('/auth/register', userData, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    // Store tokens in localStorage (access token only for client-side usage)
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error during registration');
  }
};

// Login user
export const login = async (credentials: { phone: string; password: string }) => {
  try {
    // Get CSRF token first
    const csrfToken = await getCsrfToken();
    
    // Make login request with CSRF token
    const response = await api.post('/auth/login', credentials, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    // Store tokens in localStorage (access token only for client-side usage)
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error during login');
  }
};

// Logout user
export const logout = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('accessToken');
    
    // Clear cookies by making a request to the server
    await api.post('/auth/logout');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Even if server request fails, clear local storage
    localStorage.removeItem('accessToken');
    return { success: false, error };
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token');
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await api.get('/auth/profile', {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

// Setup axios interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await refreshToken();
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default {
  register,
  login,
  logout,
  refreshToken,
  getUserProfile
};