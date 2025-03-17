import axios, { AxiosError } from "axios";
import axiosInstance from "./axios";
import { showToast } from "./toast";
import { setAuthToken, getAuthToken, removeAuthToken } from "./cookies";

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

export interface GithubOAuthToken {
  token_expired: boolean;
  refresh_token_expired: boolean;
}

export interface GithubOAuthLoginResponse {
  oauth_login_url: string;
}

export interface GithubOAuthCallbackParams {
  code: string;
  state: string;
}

export interface GithubOAuthCallbackResponse {
  success: boolean;
  state: Record<string, unknown>;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  github_oauth_token: GithubOAuthToken | null;
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
        return "Authentication failed. Please log in again.";
      }

      // Validation errors
      if (status === 422 && data.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail
            .map((err: ValidationError) => `${err.loc[1]}: ${err.msg}`)
            .join(", ");
        }
        return data.detail;
      }

      // Server errors
      if (status >= 500) {
        return "Server error. Please try again later.";
      }

      // Other errors with messages
      if (data.message) {
        return data.message;
      }

      if (data.detail) {
        return typeof data.detail === "string"
          ? data.detail
          : "Validation error";
      }
    }

    // Network errors
    if (axiosError.code === "ECONNABORTED") {
      return "Request timed out. Please check your connection.";
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // Fallback error message
  return "An unexpected error occurred. Please try again.";
};

// Auth service
const AuthService = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<User> => {
    try {
      const loadingToast = showToast.loading(
        "Creating your account...",
        "register-toast"
      );
      const response = await axiosInstance.post<User>(
        "/auth/register",
        userData
      );
      showToast.dismiss(loadingToast);
      showToast.success("Account created successfully!", "register-toast");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "register-toast");
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<Token> => {
    try {
      const loadingToast = showToast.loading("Logging in...", "login-toast");
      const response = await axiosInstance.post<Token>(
        "/auth/login",
        credentials
      );
      showToast.dismiss(loadingToast);

      // Store token in cookie
      setAuthToken(response.data.access_token);

      showToast.success("Logged in successfully!", "login-toast");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "login-toast");
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    removeAuthToken();
    showToast.success("Logged out successfully", "logout-toast");
    // Optionally redirect to login page
    window.location.href = "/login";
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
      const response = await axiosInstance.get<User>("/users/me");
      return response.data;
    } catch (error) {
      // If token is invalid or expired, logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        AuthService.logout();
      }
      return null;
    }
  },

  getAuthStatus: async (): Promise<{
    isAuthenticated: boolean;
    user: User | null;
  }> => {
    const isAuth = AuthService.isAuthenticated();
    const user = isAuth ? await AuthService.getCurrentUser() : null;
    return { isAuthenticated: isAuth, user };
  },

  // Get GitHub OAuth URL
  getGithubOAuthUrl: async (redirectUri: string, expiryMinutes: number = 10): Promise<string> => {
    try {
      const loadingToast = showToast.loading("Fetching GitHub authentication URL...", "github-oauth-toast");
      const response = await axiosInstance.get<GithubOAuthLoginResponse>(
        `/github/oauth/login`, {
          params: {
            redirect_uri: redirectUri,
            expiry_minutes: expiryMinutes
          }
        }
      );
      showToast.dismiss(loadingToast);
      return response.data.oauth_login_url;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "github-oauth-toast");
      throw error;
    }
  },

  // Handle GitHub OAuth callback
  handleGithubOAuthCallback: async (params: GithubOAuthCallbackParams): Promise<GithubOAuthCallbackResponse> => {
    try {
      const loadingToast = showToast.loading("Processing GitHub authentication...", "github-oauth-callback-toast");
      const response = await axiosInstance.post<GithubOAuthCallbackResponse>(
        `/github/oauth/callback`, 
        params
      );
      showToast.dismiss(loadingToast);
      
      if (response.data.success) {
        showToast.success("GitHub authentication successful!", "github-oauth-callback-toast");
      } else {
        showToast.error("GitHub authentication failed", "github-oauth-callback-toast");
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "github-oauth-callback-toast");
      throw error;
    }
  },
};

export default AuthService;
