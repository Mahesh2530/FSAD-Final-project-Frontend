/**
 * API Utilities for FoodShare application
 * Provides consistent methods for making API requests
 */
import axios from 'axios';
import envConfig from '../config/envConfig';
import { API_ENDPOINTS, createApiUrl } from '../config/apiConfig';
import { env } from './environmentUtils';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: envConfig.CURRENT.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token, etc.
apiClient.interceptors.request.use(
  config => {
    // Get token from localStorage or another auth storage
    // Only access localStorage in browser environment
    let token = null;
    if (env.isBrowser()) {
      token = localStorage.getItem('authToken');
    }
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      // Only clear auth data and redirect in browser environment
      if (env.isBrowser()) {
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // If not already on login page, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * API service providing methods for common API operations
 */
export const apiService = {
  /**
   * Get data from an API endpoint
   * 
   * @param {string} endpoint - The API endpoint
   * @param {Object} queryParams - Optional query parameters
   * @returns {Promise} Promise resolving to the response data
   */
  get: async (endpoint, queryParams = {}) => {
    const url = createApiUrl(endpoint, queryParams);
    const response = await apiClient.get(url);
    return response.data;
  },
  
  /**
   * Post data to an API endpoint
   * 
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The data to send
   * @returns {Promise} Promise resolving to the response data
   */
  post: async (endpoint, data = {}) => {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  },
  
  /**
   * Put data to an API endpoint (update)
   * 
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The data to update
   * @returns {Promise} Promise resolving to the response data
   */
  put: async (endpoint, data = {}) => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  },
  
  /**
   * Delete a resource at an API endpoint
   * 
   * @param {string} endpoint - The API endpoint
   * @returns {Promise} Promise resolving to the response data
   */
  delete: async (endpoint) => {
    const response = await apiClient.delete(endpoint);
    return response.data;
  }
};

/**
 * API module containing pre-configured methods for each API endpoint
 */
export const api = {
  // User related API methods
  user: {
    getProfile: (userId) => apiService.get(API_ENDPOINTS.USER.PROFILE(userId)),
    updateProfile: (userId, userData) => apiService.put(API_ENDPOINTS.USER.PROFILE(userId), userData),
    login: (credentials) => apiService.post(API_ENDPOINTS.USER.LOGIN, credentials),
    register: (userData) => apiService.post(API_ENDPOINTS.USER.REGISTER, userData),
    logout: () => apiService.post(API_ENDPOINTS.USER.LOGOUT)
  },
  
  // Donation related API methods
  donations: {
    getAll: (params) => apiService.get(API_ENDPOINTS.DONATION.LIST, params),
    getById: (donationId) => apiService.get(API_ENDPOINTS.DONATION.DETAIL(donationId)),
    create: (donationData) => apiService.post(API_ENDPOINTS.DONATION.CREATE, donationData),
    update: (donationId, donationData) => apiService.put(API_ENDPOINTS.DONATION.UPDATE(donationId), donationData),
    delete: (donationId) => apiService.delete(API_ENDPOINTS.DONATION.DELETE(donationId)),
    claim: (donationId, claimData) => apiService.post(API_ENDPOINTS.DONATION.CLAIM(donationId), claimData)
  },
  
  // Admin related API methods
  admin: {
    getDashboard: () => apiService.get(API_ENDPOINTS.ADMIN.DASHBOARD),
    getUsers: (params) => apiService.get(API_ENDPOINTS.ADMIN.USERS, params),
    updateUserStatus: (userId, statusData) => apiService.put(API_ENDPOINTS.ADMIN.USER_STATUS(userId), statusData)
  },
  
  // Rewards related API methods
  rewards: {
    getUserRewards: (userId) => apiService.get(API_ENDPOINTS.REWARDS.USER_REWARDS(userId)),
    redeem: (rewardData) => apiService.post(API_ENDPOINTS.REWARDS.REDEEM, rewardData)
  },
  
  // KPI and impact metrics
  metrics: {
    getKpiStats: () => apiService.get(API_ENDPOINTS.KPI.STATS),
    getDonorImpact: (donorId) => apiService.get(API_ENDPOINTS.IMPACT.DONOR(donorId)),
    getBeneficiaryImpact: (beneficiaryId) => apiService.get(API_ENDPOINTS.IMPACT.BENEFICIARY(beneficiaryId))
  },
  
  // Notifications
  notifications: {
    getNotifications: (userId, params) => apiService.get(`/api/v1/notifications?user_id=${userId}`, params),
    markAsRead: (notificationId) => apiService.patch(`/api/v1/notifications/${notificationId}/read`),
    sendNotification: (notificationData) => apiService.post('/api/v1/notifications', notificationData)
  }
};

export default api;
