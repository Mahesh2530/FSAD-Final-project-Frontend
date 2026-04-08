# API Configuration

This directory contains the API configuration for the FoodShare application.

## Overview

The `apiConfig.js` file centralizes all API-related configuration settings, making it easier to:

1. Change API endpoints in one place
2. Switch between different environments (development, staging, production)
3. Maintain consistency in API calls across the application

The `envConfig.js` file manages environment-specific settings that can change between environments.

## Usage

### Importing

```javascript
import { API_BASE_URL, API_ENDPOINTS, createApiUrl } from '../config/apiConfig';
import envConfig from '../config/envConfig';
```

### Examples

#### Basic Usage

```javascript
// Get a user profile
const fetchProfile = async (userId) => {
  try {
    const response = await axios.get(API_ENDPOINTS.USER.PROFILE(userId));
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Create a new donation
const createDonation = async (donationData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.DONATION.CREATE, donationData);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};
```

#### Using with Query Parameters

```javascript
import { createApiUrl } from '../config/apiConfig';

// Search for donations with query parameters
const searchDonations = async (searchParams) => {
  try {
    const url = createApiUrl(API_ENDPOINTS.DONATION.LIST, searchParams);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching donations:', error);
    throw error;
  }
};

// Example call
searchDonations({
  food_type: 'produce',
  city: 'Anytown',
  max_distance: 10
});
```

## Configuration Structure

The configuration file provides:

- `API_BASE_URL`: The base URL for all API endpoints
- `API_ENDPOINTS`: An object containing all endpoint paths organized by feature
- `createApiUrl()`: A utility function to create URLs with query parameters

## Changing Environments

To change environments (e.g., from development to production), modify the `envConfig.js` file or set the appropriate environment variables.

```javascript
// Using the environment utilities to safely access environment variables
import { env } from '../utils/environmentUtils';

// Determine current environment
const NODE_ENV = env.get('NODE_ENV', 'development');
```

You can set the environment in different ways:

1. In `.env` files (for Vite applications):
   ```
   NODE_ENV=production
   ```

2. Through environment variables when starting the application:
   ```bash
   # Windows PowerShell
   $env:NODE_ENV="production"; npm run dev
   
   # Linux/MacOS
   NODE_ENV=production npm run dev
   ```

## Adding New Endpoints

When adding new features that require API endpoints, please add them to the appropriate section in the `API_ENDPOINTS` object in `apiConfig.js`.
