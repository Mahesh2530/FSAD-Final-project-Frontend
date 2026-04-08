/**
 * Authentication Utilities for FoodShare application
 * Provides centralized methods for authentication operations
 */
import { api } from './apiUtils';

/**
 * Authentication service providing methods for login, logout, and auth state management
 */
export const authService = {
  /**
   * Login user with credentials
   * 
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} Promise resolving to the user data
   */
  login: async (credentials) => {
    try {
      const response = await api.user.login(credentials);
      
      // Store authentication data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      localStorage.setItem('user', JSON.stringify(response));
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  },
  
  /**
   * Logout current user
   * 
   * @returns {Promise} Promise resolving to the logout result
   */
  logout: async () => {
    try {
      // Call logout API endpoint
      await api.user.logout();
      
      // Clear authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed. Please try again.' 
      };
    }
  },
  
  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
  
  /**
   * Get current user data
   * 
   * @returns {Object|null} User data or null if not authenticated
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  /**
   * Get authentication token
   * 
   * @returns {string|null} Auth token or null if not authenticated
   */
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  }
};
