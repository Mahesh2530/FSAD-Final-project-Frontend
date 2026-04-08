import { http, HttpResponse } from 'msw';
import { mockKpiData, mockDonations, mockRewards, mockDonorImpact, mockBeneficiaryImpact, foodCategories, mockUsers, mockAdminAnalytics, mockUserProfiles, mockNotifications } from './mockData';
import { API_BASE_URL } from '../config/apiConfig';

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reduced timeout for faster mock API responses
const MOCK_DELAY = 300; // reduced from 600-1000ms to 300ms

export const handlers = [
  // Handler for KPIs
  http.get('/api/v1/kpis', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(mockKpiData);
  }),
    // Handler for notifications - Get user notifications
  http.get('/api/v1/notifications', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    // Parse URL to get query parameters
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '5');
    
    if (!user_id) {
      return new HttpResponse(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400 }
      );
    }
    
    // Filter notifications by user
    const userNotifications = mockNotifications.filter(
      notification => notification.user_id === user_id
    );
    
    // Calculate pagination
    const start = page * size;
    const end = start + size;
    const paginatedNotifications = userNotifications.slice(start, end);
    const totalElements = userNotifications.length;
    const totalPages = Math.ceil(totalElements / size);
    
    return HttpResponse.json({
      content: paginatedNotifications,
      page: page,
      size: size,
      total_elements: totalElements,
      total_pages: totalPages
    });
  }),
    // Handler for marking notification as read
  http.patch('/api/v1/notifications/:notification_id/read', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { notification_id } = params;
    
    // Find the notification in mock data
    const notificationIndex = mockNotifications.findIndex(
      notification => notification.notification_id === notification_id
    );
    
    if (notificationIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Notification not found' }),
        { status: 404 }
      );
    }
    
    // Mark as read
    mockNotifications[notificationIndex].is_read = true;
    
    return HttpResponse.json({
      success: true,
      notification: mockNotifications[notificationIndex]
    });
  }),
    // Handler for user registration
  http.post('/api/v1/users/register', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    const requestBody = await request.json();
    
    // Basic validation - email format and required fields
    if (!requestBody.email || !requestBody.email.includes('@')) {
      return new HttpResponse(
        JSON.stringify({ message: 'Invalid email format' }),
        { status: 400 }
      );
    }
    
    if (!requestBody.username || !requestBody.password_hash || !requestBody.role) {
      return new HttpResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Simulating an existing email (for demo purposes)
    if (requestBody.email === 'existing@example.com') {
      return new HttpResponse(
        JSON.stringify({ message: 'Email already registered' }),
        { status: 409 }
      );
    }
    
    // Success response
    return HttpResponse.json({
      user_id: crypto.randomUUID(),
      username: requestBody.username,
      email: requestBody.email,
      role: requestBody.role
    });
  }),
      // Handler for user login
  http.post('/api/v1/users/login', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    const requestBody = await request.json();
    
    // Basic validation
    if (!requestBody.email || !requestBody.password_hash) {
      return new HttpResponse(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }
    
    // Demo credentials for testing
    const validCredentials = [
      { 
        email: 'donor@example.com', 
        password: 'password123',
        userData: {
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'John Donor',
          email: 'donor@example.com',
          role: 'donor'
        }
      },
      { 
        email: 'beneficiary@example.com', 
        password: 'password123',
        userData: {
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          username: 'Mary Beneficiary',
          email: 'beneficiary@example.com',
          role: 'beneficiary'
        }
      },
      { 
        email: 'admin@example.com', 
        password: 'password123',
        userData: {
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          username: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      },
    ];
    
    // Find matching user
    const user = validCredentials.find(
      cred => cred.email === requestBody.email && cred.password === requestBody.password_hash
    );
    
    if (user) {
      // Generate a mock token
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Return user data with token
      return HttpResponse.json({
        ...user.userData,
        token
      });
    } else {
      return new HttpResponse(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }
  }),
    // Handler for user logout
  http.post('/api/v1/auth/logout', async () => {
    await delay(MOCK_DELAY);
    
    // In a real app, this would invalidate the token on the server
    
    return HttpResponse.json({
      success: true,
      message: 'Successfully logged out'
    });
  }),
    // Also handle the endpoint without /auth/ for compatibility
  http.post('/api/v1/users/logout', async () => {
    await delay(MOCK_DELAY);
    
    return HttpResponse.json({
      success: true,
      message: 'Successfully logged out'
    });
  }),
  // Handler to get donor's donations
  http.get('/api/v1/donations', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    // Check for donor_id in URL params
    const url = new URL(request.url);
    const donorId = url.searchParams.get('donor_id');
    
    if (donorId) {
      const donorDonations = mockDonations.filter(
        donation => donation.donor_id === donorId
      );
      return HttpResponse.json(donorDonations);
    }
    
    // If no donor_id specified, return all donations (admin view)
    return HttpResponse.json(mockDonations);
  }),
    // Handler to get a single donation
  http.get('/api/v1/donations/:donationId', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { donationId } = params;
    const donation = mockDonations.find(d => d.donation_id === donationId);
    
    if (donation) {
      return HttpResponse.json(donation);
    } else {
      return new HttpResponse(
        JSON.stringify({ message: 'Donation not found' }),
        { status: 404 }
      );
    }
  }),
    // Handler to create a new donation
  http.post('/api/v1/donations', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    const requestBody = await request.json();
    
    // Basic validation
    if (!requestBody.food_name || !requestBody.quantity || !requestBody.food_type) {
      return new HttpResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Create new donation
    const newDonation = {
      donation_id: crypto.randomUUID(),
      donor_id: requestBody.donor_id,
      food_name: requestBody.food_name,
      quantity: requestBody.quantity,
      quantity_unit: requestBody.quantity_unit,
      food_type: requestBody.food_type,
      expiry_date: requestBody.expiry_date,
      pickup_address: requestBody.pickup_address,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: requestBody.image_url || 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D'
    };
    
    // In a real app, this would be added to a database
    // For the mock, we're just returning the new donation
    return HttpResponse.json(newDonation);
  }),
    // Handler to update a donation
  http.put('/api/v1/donations/:donationId', async ({ request, params }) => {
    await delay(MOCK_DELAY);
    
    const { donationId } = params;
    const requestBody = await request.json();
    
    // In a real app, find and update the donation in the database
    // For the mock, return the updated donation
    return HttpResponse.json({
      ...requestBody,
      donation_id: donationId,
      updated_at: new Date().toISOString()
    });
  }),
    // Get donor rewards
  http.get('/api/v1/rewards/user/:userId', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { userId } = params;
    const userRewards = mockRewards.find(r => r.user_id === userId);
    
    if (userRewards) {
      return HttpResponse.json(userRewards);
    } else {
      return new HttpResponse(
        JSON.stringify({ message: 'Rewards not found for user' }),
        { status: 404 }
      );
    }
  }),  // Get donor impact metrics
  http.get('/api/v1/impact/donor/:donorId', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { donorId } = params;
    
    // Since mockDonorImpact is an object, not an array, 
    // directly check if the donor_id matches
    if (mockDonorImpact.donor_id === donorId) {
      return HttpResponse.json(mockDonorImpact);
    } else {
      return new HttpResponse(
        JSON.stringify({ message: 'Impact metrics not found for donor' }),
        { status: 404 }
      );
    }
  }),
    // Get beneficiary impact metrics
  http.get('/api/v1/impact/beneficiary/:beneficiaryId', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { beneficiaryId } = params;
    
    // If the beneficiary ID matches our mock data, return it
    if (mockBeneficiaryImpact && mockBeneficiaryImpact.beneficiary_id === beneficiaryId) {
      return HttpResponse.json(mockBeneficiaryImpact);
    } else {
      // Otherwise, create a generic impact data with the correct ID
      const genericImpact = {
        ...mockBeneficiaryImpact,
        beneficiary_id: beneficiaryId
      };
      return HttpResponse.json(genericImpact);
    }
  }),

  // Get food categories
  http.get('/api/v1/food_categories', () => {
    return HttpResponse.json(foodCategories);
  }),
    // Handler for food categories
  http.get('/api/v1/categories/food', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(foodCategories);
  }),
    // Handler for donation requests
  http.get('/api/v1/donation_requests', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    // Parse URL to get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    
    if (!userId || userId === 'undefined') {
      return new HttpResponse(
        JSON.stringify({ message: 'Valid user ID is required' }),
        { status: 400 }
      );
    }
    
    // We don't have mock donation requests data, so return an empty array
    // In a real implementation, we would filter by user ID
    return HttpResponse.json([]);
  }),
    // Handler for creating a donation request
  http.post('/api/v1/donation_requests', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    const requestBody = await request.json();
    
    // Basic validation
    if (!requestBody.user_id || !requestBody.donation_id) {
      return new HttpResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Create new request with mock data
    const newRequest = {
      request_id: crypto.randomUUID(),
      user_id: requestBody.user_id,
      donation_id: requestBody.donation_id,
      beneficiary_id: requestBody.beneficiary_id || requestBody.user_id,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return HttpResponse.json(newRequest);
  }),
    // Handler for deleting a donation request
  http.delete('/api/v1/donation_requests/:requestId', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { requestId } = params;
    
    // Just return success since we don't actually store the data
    return HttpResponse.json({
      success: true,
      message: `Request ${requestId} successfully deleted`
    });
  }),
    // Get admin dashboard data
  http.get('/api/v1/admin/dashboard', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(mockAdminAnalytics);
  }),
    // Get users for admin
  http.get('/api/v1/admin/users', async () => {
    await delay(MOCK_DELAY);
    return HttpResponse.json(mockUsers);
  }),
    // Get user profile
  http.get('/api/v1/users/:userId', async ({ params }) => {
    await delay(MOCK_DELAY);
    
    const { userId } = params;
    const userProfile = mockUserProfiles.find(p => p.user_id === userId);
    
    if (userProfile) {
      return HttpResponse.json(userProfile);
    } else {
      return new HttpResponse(
        JSON.stringify({ message: 'User profile not found' }),
        { status: 404 }
      );
    }
  }),
  // Update user profile
  http.put('/api/v1/users/:userId', async ({ params, request }) => {
    await delay(MOCK_DELAY);
    
    const { userId } = params;
    const requestBody = await request.json();
    
    // In a real app, find and update the user in the database
    // For the mock, return the updated user data
    return HttpResponse.json({
      ...requestBody,
      user_id: userId,
      updated_at: new Date().toISOString()
    });  }),
  
  // Handler for search donations
  http.get('/api/v1/donations/search', async ({ request }) => {
    await delay(MOCK_DELAY);
    
    // Parse URL to get query parameters
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const foodCategory = url.searchParams.get('food_category');
    const location = url.searchParams.get('location');
    
    // Filter donations based on search criteria
    let filteredDonations = [...mockDonations].filter(donation => 
      donation.status === 'available'
    );
      // Filter by keyword
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredDonations = filteredDonations.filter(donation => 
        donation.food_name.toLowerCase().includes(lowerKeyword) ||
        donation.food_type.toLowerCase().includes(lowerKeyword) ||
        (donation.description && donation.description.toLowerCase().includes(lowerKeyword))
      );
    }
    
    // Filter by food category
    if (foodCategory && foodCategory !== 'all') {
      filteredDonations = filteredDonations.filter(donation => 
        donation.food_type.toLowerCase() === foodCategory.toLowerCase()
      );
    }
      // Filter by location
    if (location) {
      const lowerLocation = location.toLowerCase();
      filteredDonations = filteredDonations.filter(donation => 
        donation.pickup_address && donation.pickup_address.toLowerCase().includes(lowerLocation)
      );
    }
    
    return HttpResponse.json({
      content: filteredDonations,
      total_elements: filteredDonations.length,
      total_pages: 1,
      page: 0,
      size: filteredDonations.length
    });
  })
];
