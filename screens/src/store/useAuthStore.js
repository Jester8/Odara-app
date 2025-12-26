import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // Initialize auth on app startup
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');

      if (!token) {
        set({ 
          isAuthenticated: false, 
          isLoading: false,
          token: null,
          user: null 
        });
        return;
      }

      // Validate token is not expired
      const isValid = await get().validateToken();

      if (isValid && userData) {
        set({
          token,
          user: JSON.parse(userData),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Token expired or invalid
        await get().logout();
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
      set({ 
        isAuthenticated: false, 
        isLoading: false,
        error: 'Failed to initialize authentication'
      });
    }
  },

  // Set token and save to secure storage
  setToken: async (token) => {
    try {
      // Validate token format
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token format');
      }

      // Verify token is not expired before saving
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded?.exp && decoded.exp < currentTime) {
          throw new Error('Token is already expired');
        }
      } catch (decodeError) {
        console.log('Token decode error:', decodeError);
        // Don't throw - token might be valid but just not decodable
      }

      await SecureStore.setItemAsync('userToken', token);
      
      // Set axios default header for API requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ token, isAuthenticated: true });
    } catch (error) {
      console.log('Error setting token:', error);
      set({ error: 'Failed to save authentication token' });
      throw error;
    }
  },

  // Set user data and save to secure storage
  setUser: async (user) => {
    try {
      if (!user || !user.id) {
        throw new Error('Invalid user data');
      }

      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.log('Error setting user:', error);
      set({ error: 'Failed to save user data' });
      throw error;
    }
  },

  // Validate token expiration
  validateToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        console.log('🔐 No token found');
        return false;
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired (with 1 minute buffer)
      if (decoded?.exp && decoded.exp < currentTime + 60) {
        console.log('🔐 Token expired or expiring soon');
        return false;
      }

      console.log('✅ Token is valid');
      return true;
    } catch (error) {
      console.log('Token validation error:', error);
      return false;
    }
  },

  // Logout and clear all auth data
  logout: async () => {
    try {
      // Clear from secure storage
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Clear axios auth header
      delete axios.defaults.headers.common['Authorization'];
      
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      });

      console.log('✅ Logged out successfully');
    } catch (error) {
      console.log('Logout error:', error);
      set({ error: 'Failed to logout' });
    }
  },

  // Clear error messages
  clearError: () => set({ error: null }),
  
  // Set error message
  setError: (error) => set({ error }),
}));

export default useAuthStore;