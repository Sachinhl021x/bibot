import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isRagEnabled, setIsRagEnabled] = useState(false);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleRagToggle = (enabled) => {
    setIsRagEnabled(enabled);
  };

  return (
    <div className="App">
      <Sidebar 
        onModelSelect={handleModelSelect} 
        onFileUpload={handleFileUpload}
        onRagToggle={handleRagToggle}
      />
      <ChatInterface 
        selectedModel={selectedModel} 
        isRagEnabled={isRagEnabled}
      />
    </div>
  );
}

export default App;