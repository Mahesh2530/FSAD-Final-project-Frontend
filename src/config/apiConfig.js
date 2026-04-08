/**
 * API Configuration for FoodShare application
 * This file centralizes all API-related configuration settings
 */
import envConfig from './envConfig';

// Base API URL - based on current environment
export const API_BASE_URL = envConfig.CURRENT.BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // User related endpoints
  USER: {
    PROFILE: (userId) => `${API_BASE_URL}/users/${userId}`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  
  // Donation related endpoints
  DONATION: {
    LIST: `${API_BASE_URL}/donations`,
    DETAIL: (donationId) => `${API_BASE_URL}/donations/${donationId}`,
    CREATE: `${API_BASE_URL}/donations`,
    UPDATE: (donationId) => `${API_BASE_URL}/donations/${donationId}`,
    DELETE: (donationId) => `${API_BASE_URL}/donations/${donationId}`,
    CLAIM: (donationId) => `${API_BASE_URL}/donations/${donationId}/claim`,
  },
  
  // Admin related endpoints
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    USERS: `${API_BASE_URL}/admin/users`,
    USER_STATUS: (userId) => `${API_BASE_URL}/admin/users/${userId}/status`,
  },
  
  // Rewards related endpoints
  REWARDS: {
    USER_REWARDS: (userId) => `${API_BASE_URL}/rewards/user/${userId}`,
    REDEEM: `${API_BASE_URL}/rewards/redeem`,
  },
  
  // KPI data endpoint
  KPI: {
    STATS: `${API_BASE_URL}/kpi`,
  },
    // Impact metrics
  IMPACT: {
    DONOR: (donorId) => `${API_BASE_URL}/impact/donor/${donorId}`,
    BENEFICIARY: (beneficiaryId) => `${API_BASE_URL}/impact/beneficiary/${beneficiaryId}`,
  },
  
  // Donation requests
  DONATION_REQUESTS: {
    LIST: `${API_BASE_URL}/donation_requests`,
    DETAIL: (requestId) => `${API_BASE_URL}/donation_requests/${requestId}`,
    CREATE: `${API_BASE_URL}/donation_requests`,
    UPDATE: (requestId) => `${API_BASE_URL}/donation_requests/${requestId}`,
    DELETE: (requestId) => `${API_BASE_URL}/donation_requests/${requestId}`
  },
  
  // Categories
  CATEGORIES: {
    FOOD: `${API_BASE_URL}/categories/food`
  }
};

/**
 * Create an API URL with optional query parameters
 * 
 * @param {string} endpoint - The API endpoint
 * @param {Object} queryParams - Optional query parameters as an object
 * @returns {string} The complete API URL with query parameters
 */
export const createApiUrl = (endpoint, queryParams = {}) => {
  const url = new URL(endpoint, window.location.origin);
  
  // Add query parameters
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== undefined && queryParams[key] !== null) {
      url.searchParams.append(key, queryParams[key]);
    }
  });
  
  return url.toString();
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  createApiUrl
};
