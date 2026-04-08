// Mock data for FoodShare platform
export const mockKpiData = {
  kpi_id: "123e4567-e89b-12d3-a456-426614174000",
  total_food_saved_kg: 7580,
  total_donations: 1245,
  total_meals_served: 22740,
  total_beneficiaries: 5680,
  total_carbon_offset_kg: 15160,
  updated_at: "2025-05-09T08:00:00Z"
};

// Mock notifications data
export const mockNotifications = [
  {
    notification_id: "c81d4e2e-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440000", // Donor user
    message: "Your donation (Rice and Beans) has been successfully picked up by Helping Hands Food Bank.",
    type: "donation_status",
    is_read: false,
    created_at: "2025-05-09T14:30:00Z"
  },
  {
    notification_id: "c81d4f9a-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440000", // Donor user
    message: "Your canned goods donation is expiring in 48 hours. Please consider updating the pickup deadline.",
    type: "expiry_alert",
    is_read: false,
    created_at: "2025-05-09T10:15:00Z"
  },
  {
    notification_id: "c81d50b2-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440001", // Beneficiary user
    message: "Your request for Fresh Produce has been approved. Please check the pickup details.",
    type: "request_update",
    is_read: true,
    created_at: "2025-05-08T16:45:00Z"
  },
  {
    notification_id: "c81d51ca-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440001", // Beneficiary user
    message: "New donation of Fresh Fruits is available in your area. Check it out!",
    type: "general",
    is_read: false,
    created_at: "2025-05-08T09:30:00Z"
  },
  {
    notification_id: "c81d52d8-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440000", // Donor user
    message: "Thank you for your recent donation! You've earned 25 reward points.",
    type: "general",
    is_read: true,
    created_at: "2025-05-07T14:00:00Z"
  },
  {
    notification_id: "c81d53fa-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440001", // Beneficiary user
    message: "Your feedback on the recent donation has been received. Thank you!",
    type: "general",
    is_read: true,
    created_at: "2025-05-07T11:20:00Z"
  },
  {
    notification_id: "c81d5508-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440000", // Donor user
    message: "Community milestone achieved! Our users have collectively donated over 5,000 meals this month.",
    type: "general",
    is_read: false,
    created_at: "2025-05-06T15:45:00Z"
  },
  {
    notification_id: "c81d5616-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440001", // Beneficiary user
    message: "Your requested items from Green Grocers have been confirmed for pickup tomorrow.",
    type: "request_update",
    is_read: false,
    created_at: "2025-05-06T13:10:00Z"
  },
  {
    notification_id: "c81d5724-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440000", // Donor user
    message: "Your bread donation is expiring soon. Please update the status if it's been picked up.",
    type: "expiry_alert",
    is_read: true,
    created_at: "2025-05-05T16:30:00Z"
  },
  {
    notification_id: "c81d5832-bcf2-11ec-9d64-0242ac120002",
    user_id: "550e8400-e29b-41d4-a716-446655440001", // Beneficiary user
    message: "New food safety guidelines have been published. Please review them before your next pickup.",
    type: "general",
    is_read: false,
    created_at: "2025-05-05T09:00:00Z"
  }
];

// Mock user profile data
export const mockUserProfiles = {
  // Donor profile
  '550e8400-e29b-41d4-a716-446655440000': {
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'John Donor',
    email: 'donor@example.com',
    role: 'donor',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    postal_code: '94101',
    country: 'USA',
    latitude: 37.7749,
    longitude: -122.4194,
    is_active: true,
    created_at: '2024-11-15T10:30:00Z',
    updated_at: '2025-03-21T14:45:22Z'
  },
  
  // Beneficiary profile
  '550e8400-e29b-41d4-a716-446655440001': {
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'Mary Beneficiary',
    email: 'beneficiary@example.com',
    role: 'beneficiary',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Avenue',
    city: 'Othertown',
    state: 'NY',
    postal_code: '10001',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.0060,
    is_active: true,
    created_at: '2024-12-05T09:15:30Z',
    updated_at: '2025-04-10T11:22:15Z'
  },
  
  // Admin profile
  '550e8400-e29b-41d4-a716-446655440002': {
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    username: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    phone: '+1 (555) 345-6789',
    address: '789 System Drive',
    city: 'Adminville',
    state: 'WA',
    postal_code: '98101',
    country: 'USA',
    latitude: 47.6062,
    longitude: -122.3321,
    is_active: true,
    created_at: '2024-10-20T08:00:00Z',
    updated_at: '2025-05-01T16:30:45Z'
  }
};

// Admin dashboard analytics
export const mockAdminAnalytics = {
  donations_over_time: [
    { month: 'Jan', count: 87, weight_kg: 435 },
    { month: 'Feb', count: 102, weight_kg: 510 },
    { month: 'Mar', count: 118, weight_kg: 590 },
    { month: 'Apr', count: 130, weight_kg: 650 },
    { month: 'May', count: 142, weight_kg: 710 }
  ],
  food_by_category: [
    { category: 'produce', percentage: 32, weight_kg: 2425.6 },
    { category: 'bakery', percentage: 18, weight_kg: 1364.4 },
    { category: 'dairy', percentage: 12, weight_kg: 909.6 },
    { category: 'pantry', percentage: 15, weight_kg: 1137 },
    { category: 'meals', percentage: 10, weight_kg: 758 },
    { category: 'non-perishable', percentage: 8, weight_kg: 606.4 },
    { category: 'other', percentage: 5, weight_kg: 379 }
  ],
  geographical_impact: [
    { region: 'Downtown', donations: 312, beneficiaries: 1420 },
    { region: 'North Side', donations: 275, beneficiaries: 1250 },
    { region: 'West End', donations: 210, beneficiaries: 950 },
    { region: 'East District', donations: 248, beneficiaries: 1130 },
    { region: 'South County', donations: 200, beneficiaries: 930 }
  ],
  top_donors: [
    { donor_id: '550e8400-e29b-41d4-a716-446655440010', name: 'Green Market', donations: 87, weight_kg: 675 },
    { donor_id: '550e8400-e29b-41d4-a716-446655440011', name: 'Fresh Bakery', donations: 65, weight_kg: 430 },
    { donor_id: '550e8400-e29b-41d4-a716-446655440012', name: 'City Supermarket', donations: 54, weight_kg: 520 },
    { donor_id: '550e8400-e29b-41d4-a716-446655440013', name: 'Family Restaurant', donations: 42, weight_kg: 315 },
    { donor_id: '550e8400-e29b-41d4-a716-446655440014', name: 'Daily Harvest', donations: 38, weight_kg: 290 }
  ],
  platform_growth: {
    users_growth: [
      { month: 'Jan', donors: 45, beneficiaries: 78 },
      { month: 'Feb', donors: 52, beneficiaries: 85 },
      { month: 'Mar', donors: 61, beneficiaries: 97 },
      { month: 'Apr', donors: 70, beneficiaries: 110 },
      { month: 'May', donors: 82, beneficiaries: 128 }
    ],
    monthly_active_users: 710,
    average_donation_per_donor: 15.2,
    average_claim_time_hours: 8.4
  }
};

// Mock user data for admin management
export const mockUsers = [
  {
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'John Donor',
    email: 'donor@example.com',
    role: 'donor',
    status: 'active',
    created_at: '2025-01-15T12:30:00Z',
    donations_count: 27,
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    organization: 'Green Market'
  },
  {
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'Mary Beneficiary',
    email: 'beneficiary@example.com',
    role: 'beneficiary',
    status: 'active',
    created_at: '2025-01-20T14:45:00Z',
    claims_count: 18,
    address: '456 Oak Ave, Anytown, USA',
    phone: '(555) 234-5678',
    organization: 'Community Center'
  },
  {
    user_id: '550e8400-e29b-41d4-a716-446655440010',
    username: 'Green Market Official',
    email: 'market@greenmarket.com',
    role: 'donor',
    status: 'active',
    created_at: '2024-12-10T09:20:00Z',
    donations_count: 87,
    address: '789 Market St, Anytown, USA',
    phone: '(555) 345-6789',
    organization: 'Green Market'
  },
  {
    user_id: '550e8400-e29b-41d4-a716-446655440011',
    username: 'Fresh Bakery',
    email: 'contact@freshbakery.com',
    role: 'donor',
    status: 'active',
    created_at: '2024-12-15T11:30:00Z',
    donations_count: 65,
    address: '101 Bread Lane, Anytown, USA',
    phone: '(555) 456-7890',
    organization: 'Fresh Bakery'
  },
  {
    user_id: '550e8400-e29b-41d4-a716-446655440020',
    username: 'Food Pantry Network',
    email: 'help@foodpantry.org',
    role: 'beneficiary',
    status: 'active',
    created_at: '2024-11-05T10:15:00Z',
    claims_count: 124,
    address: '202 Charity Way, Anytown, USA',
    phone: '(555) 567-8901',
    organization: 'Food Pantry Network'
  },
  {
    user_id: '550e8400-e29b-41d4-a716-446655440021',
    username: 'Homeless Shelter',
    email: 'services@shelter.org',
    role: 'beneficiary',
    status: 'active',
    created_at: '2024-11-10T13:45:00Z',
    claims_count: 98,
    address: '303 Hope St, Anytown, USA',
    phone: '(555) 678-9012',
    organization: 'City Homeless Shelter'
  },
  {
    user_id: '550e8400-e29b-41d4-a716-446655440030',
    username: 'Inactive User',
    email: 'inactive@example.com',
    role: 'donor',
    status: 'inactive',
    created_at: '2025-02-01T09:00:00Z',
    donations_count: 3,
    address: '404 Gone St, Anytown, USA',
    phone: '(555) 789-0123',
    organization: 'Former Business'
  }
];

// Mock data for donations
export const mockDonations = [
  {
    donation_id: "d1a2b3c4-e5f6-7890-a1b2-c3d4e5f67890",
    donor_id: "550e8400-e29b-41d4-a716-446655440000",
    food_name: "Fresh Vegetables Assortment",
    quantity: 15,
    quantity_unit: "kg",
    food_type: "produce",
    expiry_date: "2025-05-20T00:00:00Z",
    pickup_address: "123 Main St, Anytown, USA",
    status: "available",
    created_at: "2025-05-01T14:30:00Z",
    updated_at: "2025-05-01T14:30:00Z",
    image_url: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    donation_id: "f6e7d8c9-b0a1-2345-f6e7-d8c9b0a12345",
    donor_id: "550e8400-e29b-41d4-a716-446655440000",
    food_name: "Canned Goods",
    quantity: 24,
    quantity_unit: "cans",
    food_type: "non-perishable",
    expiry_date: "2025-12-31T00:00:00Z",
    pickup_address: "123 Main St, Anytown, USA",
    status: "claimed",
    claimed_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-04-15T10:45:00Z",
    updated_at: "2025-04-16T08:20:00Z",
    image_url: "https://images.unsplash.com/photo-1584473457293-57140647d158?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FubmVkJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    donation_id: "a9b8c7d6-e5f4-3210-a9b8-c7d6e5f43210",
    donor_id: "550e8400-e29b-41d4-a716-446655440000",
    food_name: "Bakery Items",
    quantity: 30,
    quantity_unit: "items",
    food_type: "bakery",
    expiry_date: "2025-05-10T00:00:00Z",
    pickup_address: "123 Main St, Anytown, USA",
    status: "completed",
    claimed_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-05-08T16:00:00Z",
    updated_at: "2025-05-09T10:30:00Z",
    image_url: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFrZXJ5fGVufDB8fDB8fHww"
  }
];

// Mock reward data
export const mockRewards = {
  donor_id: "550e8400-e29b-41d4-a716-446655440000",
  points: 750,
  level: "Silver",
  rewards_available: [
    {
      reward_id: "r1e2w3a4-r5d6-7890-r1e2-w3a4r5d67890",
      name: "10% Discount at GreenGrocers",
      description: "Get 10% off your next purchase at GreenGrocers stores",
      points_required: 500,
      expires_at: "2025-12-31T00:00:00Z",
      partner: "GreenGrocers",
      image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      reward_id: "r9e8w7a6-r5d4-3210-r9e8-w7a6r5d43210",
      name: "Free Coffee at EcoCafe",
      description: "Enjoy a free coffee at any EcoCafe location",
      points_required: 200,
      expires_at: "2025-08-31T00:00:00Z",
      partner: "EcoCafe",
      image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fHww"
    },
    {
      reward_id: "r5e4w3a2-r1d0-9876-r5e4-w3a2r1d09876",
      name: "Sustainability Workshop",
      description: "Free entry to the upcoming sustainability workshop",
      points_required: 1000,
      expires_at: "2025-06-30T00:00:00Z",
      partner: "EcoEducation",
      image_url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f373?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29ya3Nob3B8ZW58MHx8MHx8fDA%3D"
    }
  ],
  rewards_redeemed: [
    {
      reward_id: "r7e6w5a4-r3d2-1098-r7e6-w5a4r3d21098",
      name: "Reusable Produce Bags",
      description: "Set of 5 reusable mesh produce bags",
      points_required: 350,
      redeemed_at: "2025-04-10T09:15:00Z",
      partner: "EcoEssentials",
      image_url: "https://images.unsplash.com/photo-1610411083065-94517f22df47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmV1c2FibGUlMjBiYWdzfGVufDB8fDB8fHww"
    }
  ]
};

// Donation impact data
export const mockDonorImpact = {
  donor_id: "550e8400-e29b-41d4-a716-446655440000",
  total_donations: 27,
  total_food_donated_kg: 342,
  total_meals_provided: 1026,
  carbon_footprint_saved_kg: 684,
  monthly_stats: [
    { month: "Jan", donations: 3, kg: 45 },
    { month: "Feb", donations: 2, kg: 30 },
    { month: "Mar", donations: 4, kg: 52 },
    { month: "Apr", donations: 6, kg: 78 },
    { month: "May", donations: 12, kg: 137 }
  ]
};

// Beneficiary impact data
export const mockBeneficiaryImpact = {
  beneficiary_id: "550e8400-e29b-41d4-a716-446655440001",
  total_requests: 18,
  total_food_received_kg: 215,
  total_meals_received: 645,
  carbon_footprint_saved_kg: 430,
  totalFoodReceived: 215, // kg - added for compatibility with the ImpactMetrics component
  mealsProvided: 645, // added for compatibility with the ImpactMetrics component
  carbonFootprintReduced: 430, // kg CO2 - added for compatibility with the ImpactMetrics component
  donationsReceived: 18, // added for compatibility with the ImpactMetrics component
  avgResponseTime: 1.2, // days
  wasteReduction: 215, // kg
  impactOverTime: [
    { month: "Jan", foodReceived: 28, carbonSaved: 56 },
    { month: "Feb", foodReceived: 40, carbonSaved: 80 },
    { month: "Mar", foodReceived: 65, carbonSaved: 130 },
    { month: "Apr", foodReceived: 42, carbonSaved: 84 },
    { month: "May", foodReceived: 40, carbonSaved: 80 }
  ],
  categoryBreakdown: [
    { name: 'Produce', value: 30 },
    { name: 'Non-Perishable', value: 25 },
    { name: 'Prepared Food', value: 15 },
    { name: 'Bakery', value: 20 },
    { name: 'Other', value: 10 }
  ],
  monthly_stats: [
    { month: "Jan", requests: 2, kg: 28 },
    { month: "Feb", requests: 3, kg: 40 },
    { month: "Mar", requests: 5, kg: 65 },
    { month: "Apr", requests: 4, kg: 42 },
    { month: "May", requests: 4, kg: 40 }
  ]
};

// Food categories
export const foodCategories = [
  { value: "produce", label: "Fresh Produce" },
  { value: "bakery", label: "Bakery Items" },
  { value: "dairy", label: "Dairy Products" },
  { value: "meat", label: "Meat & Poultry" },
  { value: "pantry", label: "Pantry Items" },
  { value: "meals", label: "Prepared Meals" },
  { value: "non-perishable", label: "Non-Perishable" },
  { value: "beverages", label: "Beverages" },
  { value: "other", label: "Other" }
];
