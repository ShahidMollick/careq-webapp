// utils/apiClient.js
import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'http://localhost:5002', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch user roles
export const fetchUserRoles = async (accessToken: string) => {
  const userID=localStorage.getItem("userID")
  const response = await apiClient.get(`/user-facility-roles/${userID}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.roles; // Assuming roles are returned as a list
};

export default apiClient;
