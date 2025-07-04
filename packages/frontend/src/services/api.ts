// packages/frontend/src/services/api.ts
import axios from 'axios';

// Get the backend API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL; // For Vite

if (!API_BASE_URL) {
  console.error('VITE_APP_BACKEND_API_URL is not defined in frontend/.env');
  // You might want to throw an error or handle this more gracefully in a real app
}

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // --- REMOVE THE GLOBAL CONTENT-TYPE HERE ---
  // headers: {
  //   'Content-Type': 'application/json', // REMOVE THIS LINE
  // },
  // ------------------------------------------
});

// Function to set the API Key for protected routes
export const setAuthToken = (apiKey: string) => {
  if (apiKey) {
    api.defaults.headers['x-api-key'] = apiKey;
  } else {
    delete api.defaults.headers['x-api-key'];
  }
};

export default api;