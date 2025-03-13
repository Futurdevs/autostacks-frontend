import axios, { AxiosError } from 'axios';
import axiosInstance from './axios';
import { showToast } from './toast';
import { setAuthToken, getAuthToken, removeAuthToken } from './cookies';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ApiErrorResponse {
  detail?: string | ValidationError[];
  message?: string;
}

// Error handling
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // Handle different status codes
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      
      // Authentication errors
      if (status === 401) {
        return 'Authentication failed. Please log in again.';
      }
      
      // Validation errors
      if (status === 422 && data.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail.map((err: ValidationError) => `${err.loc[1]}: ${err.msg}`).join(', ');
        }
        return data.detail;
      }
      
      // Server errors
      if (status >= 500) {
        return 'Server error. Please try again later.';
      }
      
      // Other errors with messages
      if (data.message) {
        return data.message;
      }
      
      if (data.detail) {
        return typeof data.detail === 'string' ? data.detail : 'Validation error';
      }
    }
    
    // Network errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection.';
    }
    
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  // Fallback error message
  return 'An unexpected error occurred. Please try again.';
};

// Auth service
const AuthService = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<User> => {
    try {
      const loadingToast = showToast.loading('Creating your account...', 'register-toast');
      const response = await axiosInstance.post<User>('/auth/register', userData);
      showToast.dismiss(loadingToast);
      showToast.success('Account created successfully!', 'register-toast');
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, 'register-toast');
      throw error;
    }
  },
  
  // Login user
  login: async (credentials: LoginRequest): Promise<Token> => {
    try {
      const loadingToast = showToast.loading('Logging in...', 'login-toast');
      const response = await axiosInstance.post<Token>('/auth/login', credentials);
      showToast.dismiss(loadingToast);
      
      // Store token in cookie
      setAuthToken(response.data.access_token);
      
      showToast.success('Logged in successfully!', 'login-toast');
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, 'login-toast');
      throw error;
    }
  },
  
  // Logout user
  logout: (): void => {
    removeAuthToken();
    showToast.success('Logged out successfully', 'logout-toast');
    // Optionally redirect to login page
    window.location.href = '/login';
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    if (!AuthService.isAuthenticated()) {
      return null;
    }
    
    try {
      const response = await axiosInstance.get<User>('/users/me');
      return response.data;
    } catch (error) {
      // If token is invalid or expired, logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        AuthService.logout();
      }
      return null;
    }
  },
};

export default AuthService; 