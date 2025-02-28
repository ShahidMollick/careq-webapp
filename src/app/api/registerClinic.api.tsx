import axios from 'axios';

const API_BASE_URL = 'https://9b94-203-110-242-40.ngrok-free.app'; // Replace with your API base URL

export const registerClinic = async (clinicData: any, userId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/facilities/register`, {
      facility: clinicData,
      userId,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
