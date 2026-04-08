import { http, HttpResponse } from 'msw';
import { mockKpiData, mockDonations, mockRewards, mockDonorImpact, foodCategories, mockUsers, mockAdminAnalytics, mockUserProfiles } from './mockData';

// Helper function for network delay simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const handlers = [
  // Handler for user logout
  http.post('/api/v1/auth/logout', async () => {
    await delay(500);
    return HttpResponse.json({
      success: true,
      message: 'Successfully logged out'
    });
  }),
  
  // Also handle the endpoint without /auth/ for compatibility
  http.post('/api/v1/users/logout', async () => {
    await delay(500);
    return HttpResponse.json({
      success: true,
      message: 'Successfully logged out'
    });
  }),
  
  // Other handlers will remain the same...
];
