import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:1337'  // Local Strapi
    : '/api', // Use Netlify proxy in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Create axios instance
const api = axios.create(API_CONFIG);

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api; 