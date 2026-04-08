# FoodShare API Configuration Update

## Overview of Changes

We've significantly improved the API configuration and environment handling in the FoodShare application to ensure consistent behavior across different environments and to fix various linting issues.

## Key Changes

### 1. Centralized API Configuration

- Created `apiConfig.js` to centralize all API endpoint definitions
- Organized endpoints by feature (USER, DONATION, ADMIN, etc.)
- Added utility functions for creating URLs with query parameters

### 2. Environment-Specific Configuration

- Created `envConfig.js` to manage environment-specific settings
- Supports different configurations for development, staging, and production
- Configuration for API base URLs, timeouts, and feature flags

### 3. Improved API Utilities

- Created comprehensive API utility functions in `apiUtils.js`
- Pre-configured Axios instance with interceptors
- Service methods for common API operations (GET, POST, PUT, DELETE)
- Pre-defined API methods organized by feature

### 4. Environment Utilities

- Created `environmentUtils.js` for safe environment variable access
- Handles differences between Node.js and browser environments
- Provides feature flag checking capabilities
- Prevents errors from undefined global objects

### 5. Fixed Linting Issues

- Removed unused imports from ProfilePage.jsx
- Fixed "process is not defined" error in init-msw.js
- Ensured browser-only APIs (localStorage, window) are safely accessed

## How to Use

### API Endpoints

Use the centralized endpoint definitions:

```javascript
import { API_ENDPOINTS } from '../config/apiConfig';

// Get profile data
const getProfile = async (userId) => {
  const response = await axios.get(API_ENDPOINTS.USER.PROFILE(userId));
  return response.data;
};
```

### API Utilities

Use the pre-defined API methods:

```javascript
import { api } from '../utils/apiUtils';

// Component using API utilities
const fetchUserProfile = async (userId) => {
  try {
    const userProfile = await api.user.getProfile(userId);
    return userProfile;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};
```

### Environment Handling

Use the environment utilities for safe access to environment variables:

```javascript
import { env } from '../utils/environmentUtils';

// Safe access to environment variables
const apiKey = env.get('API_KEY', 'default-key');

// Check environment
if (env.isDevelopment()) {
  console.log('Running in development mode');
}

// Check if a feature is enabled
import { isFeatureEnabled } from '../utils/environmentUtils';

if (isFeatureEnabled('MAP_VIEW')) {
  // Initialize map component
}
```

## Benefits

1. **Maintainability**: All API endpoints defined in one place
2. **Environment Safety**: Safe access to environment-specific variables
3. **Code Consistency**: Common patterns for making API requests
4. **Error Prevention**: Safer access to browser APIs
5. **Flexibility**: Easy to switch between different environments

## Future Improvements

1. Add comprehensive error handling and retry mechanisms
2. Implement request caching for performance
3. Add request logging and performance monitoring
4. Support for authentication refresh tokens
5. Add request cancellation capabilities
