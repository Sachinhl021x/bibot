import axios from 'axios';

// Base URL for all API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create an instance of axios with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to send a chat message
export const sendChatMessage = async (message) => {
  try {
    const response = await apiClient.post('/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};

// You can add more API call functions here as your app grows