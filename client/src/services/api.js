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

// New functions for AgentInterface

export const uploadBRD = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await apiClient.post('/api/brd/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploadBRD:', error);
    throw error;
  }
};

export const listBRDs = async () => {
  try {
    const response = await apiClient.get('/api/brd/list');
    return response.data;
  } catch (error) {
    console.error('Error in listBRDs:', error);
    throw error;
  }
};

export const generateCode = async (brdKey, additionalInstructions) => {
  try {
    console.log("Sending generate code request...");
    const response = await apiClient.post('/api/brd/generate', { brdKey, additionalInstructions }, { timeout: 300000 });
    console.log("Received generate code response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in generateCode:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

export const executeCode = async (code, output) => {
  try {
    const response = await apiClient.post('/api/brd/execute', { code, output });
    return response.data;
  } catch (error) {
    console.error('Error in executeCode:', error);
    throw error;
  }
};