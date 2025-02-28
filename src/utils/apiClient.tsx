// utils/apiClient.js
import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'https://9b94-203-110-242-40.ngrok-free.app', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});


export default apiClient;
