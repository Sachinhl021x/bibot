import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onModelSelect, onFileUpload, onRagToggle }) => {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isRagEnabled, setIsRagEnabled] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    onModelSelect(model);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus('Uploading...');
    try {
      await onFileUpload(file);
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  const handleRagToggle = () => {
    setIsRagEnabled(!isRagEnabled);
    onRagToggle(!isRagEnabled);
  };

  return (
    <div className="sidebar">
      <h2>BIBot Settings</h2>
      <div className="model-selection">
        <h3>Select Model</h3>
        <select value={selectedModel} onChange={handleModelChange}>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-v1">Claude v1</option>
        </select>
      </div>
      <div className="rag-toggle">
        <h3>RAG</h3>
        <label>
          <input
            type="checkbox"
            checked={isRagEnabled}
            onChange={handleRagToggle}
          />
          Enable RAG
        </label>
      </div>
      <div className="file-upload">
        <h3>Upload File for RAG</h3>
        <input type="file" onChange={handleFileUpload} />
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default Sidebar;