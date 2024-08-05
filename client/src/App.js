import React, { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import AgentInterface from './components/AgentInterface';
import { uploadFile } from './services/api';

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isRagEnabled, setIsRagEnabled] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showAgentInterface, setShowAgentInterface] = useState(false);

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

  const toggleInterface = () => {
    setShowAgentInterface(!showAgentInterface);
  };

  return (
    <div className="App">
      <Sidebar
        onModelSelect={handleModelSelect}
        onFileUpload={handleFileUpload}
        onRagToggle={handleRagToggle}
        uploadStatus={uploadStatus}
      />
      <div className="main-content">
        <button onClick={toggleInterface} className="toggle-interface-btn">
          {showAgentInterface ? 'Switch to Chat Interface' : 'Switch to Agent Interface'}
        </button>
        {showAgentInterface ? (
          <AgentInterface />
        ) : (
          <ChatInterface
            selectedModel={selectedModel}
            isRagEnabled={isRagEnabled}
          />
        )}
      </div>
    </div>
  );
}

export default App;