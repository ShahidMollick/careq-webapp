import axios from 'axios';

/**
 * Axios instance pre-configured with common headers and settings
 * to handle ngrok interstitial pages and provide consistent API behavior
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor to add additional headers if needed
api.interceptors.request.use(
  (config) => {
    // You can add additional headers here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => {
    // If response isn't JSON but was expected to be, throw an error
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json') && 
        response.config.headers?.Accept === 'application/json') {
      console.error('Expected JSON but received:', contentType);
      console.error('Response preview:', 
        typeof response.data === 'string' ? response.data.substring(0, 100) : 'Not a string');
      
      // Convert to error for easier handling
      return Promise.reject(new Error('Received non-JSON response from server'));
    }
    return response;
  },
  (error) => {
    // Add detailed logging for errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The server responded with a status code outside of 2xx range
        console.error('API Error:', error.response.status, error.response.data);
        
        // Check if we got HTML instead of JSON (common with ngrok)
        const contentType = error.response.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
          console.error('HTML response detected. This may be an ngrok interstitial page.');
          error.message = 'Received HTML instead of JSON. Try using ngrok-skip-browser-warning header.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
