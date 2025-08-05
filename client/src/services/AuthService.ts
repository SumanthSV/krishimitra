import axios from 'axios';
import { getAuthToken } from '../utils/securityUtils.ts';

const API_URL = '/api/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'farmer' | 'advisor' | 'vendor';
  profile?: {
    farmLocation?: {
      state?: string;
      district?: string;
    };
    preferredLanguage?: string;
  };
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      profile: {
        farmSize?: number;
        farmLocation?: {
          state: string;
          district: string;
          village?: string;
          coordinates?: {
            latitude: number;
            longitude: number;
          };
        };
        crops?: string[];
        experience?: number;
        preferredLanguage: string;
        avatar?: string;
      };
      isVerified: boolean;
      lastLogin?: string;
    };
  };
}

const AuthService = {
  /**
   * Login user with email and password
   * @param credentials User login credentials
   * @returns Promise with auth response
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with auth response
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Logout the current user
   * @returns Promise with logout response
   */
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Logout failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Refresh the authentication token
   * @returns Promise with refresh token response
   */
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${API_URL}/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Token refresh failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Verify user's email with verification token
   * @param token Email verification token
   * @returns Promise with verification response
   */
  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.get(`${API_URL}/verify-email/${token}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Email verification failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Request password reset email
   * @param email User's email address
   * @returns Promise with reset request response
   */
  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Password reset request failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Reset password with reset token
   * @param token Password reset token
   * @param newPassword New password
   * @returns Promise with password reset response
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Password reset failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },
};

export default AuthService;