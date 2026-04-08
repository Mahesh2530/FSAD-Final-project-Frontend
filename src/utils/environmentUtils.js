/**
 * Environment Utilities for FoodShare application
 * Provides utilities for handling environment-specific operations
 */

/**
 * Safe access to global environment variables
 * Prevents errors when accessing undefined variables like process.env
 */
export const env = {
  /**
   * Get an environment variable with a fallback value
   * 
   * @param {string} key - The environment variable key
   * @param {*} defaultValue - The default value if not found
   * @returns {*} The environment value or default
   */
  get: (key, defaultValue = null) => {
    // Check for Vite environment variables
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || defaultValue;
    }
    
    // Check for Node.js environment variables
    if (typeof globalThis.process !== 'undefined' && globalThis.process.env) {
      return globalThis.process.env[key] || defaultValue;
    }
    
    // Fallback to default value
    return defaultValue;
  },
  
  /**
   * Check if code is running in development mode
   * 
   * @returns {boolean} True if in development mode
   */
  isDevelopment: () => {
    // Use Vite's import.meta.env.MODE for accurate detection
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.MODE === 'development' || import.meta.env.DEV === true;
    }
    return env.get('NODE_ENV', 'development') === 'development';
  },
  
  /**
   * Check if code is running in production mode
   * 
   * @returns {boolean} True if in production mode
   */
  isProduction: () => {
    // Use Vite's import.meta.env.MODE for accurate detection
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.MODE === 'production' || import.meta.env.PROD === true;
    }
    return env.get('NODE_ENV') === 'production';
  },
  
  /**
   * Check if code is running in browser environment
   * 
   * @returns {boolean} True if running in browser
   */
  isBrowser: () => {
    return typeof window !== 'undefined';
  },
  
  /**
   * Check if code is running in Node.js environment
   * 
   * @returns {boolean} True if running in Node.js
   */
  isNode: () => {
    return typeof globalThis.process !== 'undefined' && 
           typeof globalThis.process.versions !== 'undefined' && 
           typeof globalThis.process.versions.node !== 'undefined';
  },
  
  /**
   * Safe exit function that works in both Node.js and browser environments
   * 
   * @param {number} code - Exit code (only used in Node.js)
   */
  exit: (code = 0) => {
    if (env.isNode()) {
      globalThis.process.exit(code);
    } else {
      console.warn('Cannot exit process in browser environment');
    }
  }
};

/**
 * Feature flag checking
 * 
 * @param {string} featureKey - The feature flag key to check
 * @returns {boolean} True if feature is enabled
 */
export const isFeatureEnabled = (featureKey) => {
  // Check local configuration first
  if (typeof window !== 'undefined' && window.APP_CONFIG && window.APP_CONFIG.FEATURES) {
    return Boolean(window.APP_CONFIG.FEATURES[featureKey]);
  }
  
  // Check import.meta.env (Vite)
  const envKey = `FEATURE_${featureKey}`.toUpperCase();
  const envValue = env.get(envKey);
  if (envValue !== null) {
    return envValue === 'true' || envValue === true || envValue === 1;
  }
  
  // Default to feature being disabled
  return false;
};

export default {
  env,
  isFeatureEnabled
};
