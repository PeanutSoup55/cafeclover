export const CLOVER_CONFIG = {
  API_BASE_URL: 'https://api.clover.com',
  // In production, these should be environment variables
  APP_ID: process.env.VITE_CLOVER_APP_ID || 'your-app-id',
  APP_SECRET: process.env.VITE_CLOVER_APP_SECRET || 'your-app-secret',
  // OAuth redirect URI
  REDIRECT_URI: process.env.VITE_CLOVER_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  // Scopes needed for cafe operations
  SCOPES: [
    'read:merchants',
    'read:items',
    'read:categories',
    'read:orders',
    'read:payments',
    'read:employees',
    'read:inventory'
  ].join(' ')
};