import React, { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { uploadFile } from './services/api';

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isRagEnabled, setIsRagEnabled] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleFileUpload = async (file) => {
    setUploadStatus('Uploading...');
    try {
      await uploadFile(file);
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
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
        uploadStatus={uploadStatus}
      />
      <ChatInterface
        selectedModel={selectedModel}
        isRagEnabled={isRagEnabled}
      />
    </div>
  );
}

export default App;