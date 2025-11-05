// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || '/api',
  TIMEOUT: 10000,
};

// Update the API service to use this configuration
export default API_CONFIG;
