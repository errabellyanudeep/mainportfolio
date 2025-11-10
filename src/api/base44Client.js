import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6910f0e1c635ab0b093b8378", 
  requiresAuth: true // Ensure authentication is required for all operations
});
