/**
 * Environment Configuration for FoodShare application
 * This file centralizes environment-specific settings
 */
import { env } from '../utils/environmentUtils';

// Determine current environment
// In Vite, use import.meta.env.MODE which is 'production' in production builds
const NODE_ENV = import.meta.env.MODE || env.get('NODE_ENV', 'development');

// Environment Variables
const ENV = {
  // Current environment (development, staging, production)
  NODE_ENV,
  
  // API configuration
  API: {
    // Local development (uses local Spring Boot backend)
    development: {
      BASE_URL: 'http://localhost:8080/api/v1',  // Local Spring Boot backend
      TIMEOUT: 15000, // 15 seconds
      MOCK_ENABLED: false
    },
    
    // Staging environment
    staging: {
      BASE_URL: 'https://foodsharemain-production.up.railway.app/api/v1',
      TIMEOUT: 15000, // 15 seconds
      MOCK_ENABLED: false
    },
    
    // Production environment (Railway backend)
    production: {
      BASE_URL: 'https://foodsharemain-production.up.railway.app/api/v1',
      TIMEOUT: 20000, // 20 seconds
      MOCK_ENABLED: false
    }
  },
  
  // Feature flags - enable/disable features based on environment
  FEATURES: {
    REWARDS_ENABLED: true,
    MAP_VIEW_ENABLED: true,
    ANALYTICS_ENABLED: true,
    NOTIFICATIONS_ENABLED: true
  }
};

// Get current environment config
export const getCurrentEnvConfig = () => {
  return ENV.API[NODE_ENV] || ENV.API.development;
};

// Export environment variables
export default {
  ENV,
  getCurrentEnvConfig,
  // Current active configuration (based on environment)
  CURRENT: getCurrentEnvConfig(),
  // Feature flags
  FEATURES: ENV.FEATURES
};
