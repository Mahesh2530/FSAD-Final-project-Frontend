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
