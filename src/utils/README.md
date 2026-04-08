# API Utilities

This directory contains utility functions to simplify API interactions in the FoodShare application.

## Overview

The `apiUtils.js` file provides:

1. A pre-configured Axios instance with interceptors for authentication
2. Service methods for common API operations (GET, POST, PUT, DELETE)
3. Pre-defined API methods organized by feature

## Usage

### Basic Usage

```javascript
import { api } from '../utils/apiUtils';

// Component using API utilities
function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Using pre-defined API methods
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get user profile
      const userProfile = await api.user.getProfile('user-123');
      setData(userProfile);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component
}
```

### Advanced Usage

```javascript
import { apiService } from '../utils/apiUtils';
import { API_ENDPOINTS } from '../config/apiConfig';

// For custom API calls not covered by pre-defined methods
const customApiCall = async (param1, param2) => {
  try {
    // Using apiService directly
    const data = await apiService.get(
      API_ENDPOINTS.CUSTOM_ENDPOINT, 
      { param1, param2 }
    );
    return data;
  } catch (error) {
    console.error('Custom API call failed:', error);
    throw error;
  }
};
```

## Features

### API Client

- **Automatic Authentication**: Adds Bearer token to all requests
- **Error Handling**: Global error handling for common HTTP errors
- **Timeout Handling**: Configurable request timeouts
- **JSON Handling**: Automatic JSON serialization/deserialization

### Interceptors

- **Request Interceptor**: Adds authentication token from localStorage
- **Response Interceptor**: Handles common errors like 401 (Unauthorized)

### API Service Methods

- `get(endpoint, queryParams)`: Fetch data from an endpoint
- `post(endpoint, data)`: Create new resources
- `put(endpoint, data)`: Update existing resources
- `delete(endpoint)`: Delete resources

### Pre-defined API Methods

Organized by feature:

- **user**: Profile, login, registration
- **donations**: CRUD operations for donations
- **admin**: Dashboard, user management
- **rewards**: User rewards, redeem rewards
- **metrics**: KPI stats, impact metrics

## Best Practices

1. Always use try/catch blocks when calling API methods
2. Handle loading and error states appropriately
3. Provide meaningful error messages to users
4. Use the pre-defined API methods when possible for consistency
