import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendChatMessage = async (message, model, useRag) => {
  try {
    console.log(`Sending chat message: model=${model}, useRag=${useRag}, message="${message}"`);
    const response = await apiClient.post('/api/chat', { message, model, useRag });
    console.log("Received response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};