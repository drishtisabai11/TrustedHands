import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('th_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardized Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const customError = {
      message: error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred.',
      status: error.response?.status || 500,
      originalError: error,
    };

    if (error.response?.status === 401) {
      // Clear token on unauthenticated responses
      localStorage.removeItem('th_auth_token');
      // Window event for reactive session clear
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(customError);
  }
);

export default apiClient;
