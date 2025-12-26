import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import useAuthStore from '../src/store/useAuthStore';

const API_BASE_URL = 'https://odara-app.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear auth store and redirect to login
        const authStore = useAuthStore.getState();
        await authStore.logout();
        
        console.log('🔐 Token expired - user logged out');
        return Promise.reject(error);
      } catch (logoutError) {
        console.log('Logout error:', logoutError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // Sign Up
  signup: async (data) => {
    try {
      const response = await apiClient.post('/auth/signup', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      });

      if (!response.data || !response.data.user) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Signup failed. Please try again.'
      );
    }
  },

  // Sign In
  signin: async (data) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid server response');
      }

      // Store authentication data
      const authStore = useAuthStore.getState();
      await authStore.setToken(response.data.token);
      await authStore.setUser(response.data.user);

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  },

  // Verify Email
  verifyEmail: async (data) => {
    try {
      const response = await apiClient.post('/auth/verify-email', {
        email: data.email.toLowerCase().trim(),
        otp: data.otp.trim(),
      });

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      // If verification includes token, store it
      if (response.data.token && response.data.user) {
        const authStore = useAuthStore.getState();
        await authStore.setToken(response.data.token);
        await authStore.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Email verification failed.'
      );
    }
  },

  // Request Password Reset
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email: email.toLowerCase().trim(),
      });

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Password reset request failed.'
      );
    }
  },

  // Reset Password with OTP
  resetPassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        email: data.email.toLowerCase().trim(),
        token: data.token.trim(),
        newPassword: data.newPassword,
      });

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Password reset failed.'
      );
    }
  },

  // Change Password (for authenticated users)
  changePassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Password change failed.'
      );
    }
  },

  // Logout
  logout: async () => {
    try {
      // Call logout endpoint if available
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.log('Logout endpoint error:', error);
      }

      // Clear local auth state
      const authStore = useAuthStore.getState();
      await authStore.logout();

      return { success: true };
    } catch (error) {
      throw new Error('Logout failed. Please try again.');
    }
  },

  // Refresh Token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');

      if (!response.data || !response.data.token) {
        throw new Error('Invalid server response');
      }

      const authStore = useAuthStore.getState();
      await authStore.setToken(response.data.token);

      return response.data;
    } catch (error) {
      // If refresh fails, logout user
      const authStore = useAuthStore.getState();
      await authStore.logout();

      throw new Error('Session expired. Please login again.');
    }
  },
};

export default apiClient;