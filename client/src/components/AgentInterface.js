import React, { useState, useEffect } from 'react';
import { uploadBRD, listBRDs, generateCode, executeCode } from '../services/api';
import './AgentInterface.css';

const AgentInterface = () => {
  const [file, setFile] = useState(null);
  const [existingBRDs, setExistingBRDs] = useState([]);
  const [selectedBRD, setSelectedBRD] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExistingBRDs();
  }, []);

  const fetchExistingBRDs = async () => {
    try {
      console.log("Fetching existing BRDs...");
      const brds = await listBRDs();
      console.log("Fetched BRDs:", brds);
      setExistingBRDs(brds);
    } catch (error) {
      console.error('Error fetching existing BRDs:', error);
      setError('Failed to fetch existing BRDs. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleBRDSelection = (event) => {
    setSelectedBRD(event.target.value);
  };

  const handleAdditionalInstructions = (event) => {
    setAdditionalInstructions(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedCode('');
    setOutput('');

    try {
      let brdKey = selectedBRD;
      if (file) {
        console.log("Uploading new BRD file...");
        const uploadResponse = await uploadBRD(file);
        console.log("Upload response:", uploadResponse);
        brdKey = uploadResponse.key;
      }

      if (!brdKey) {
        throw new Error("No BRD selected or uploaded");
      }

      console.log("Generating code with BRD key:", brdKey);
      console.log("Additional instructions:", additionalInstructions);
      const generateResponse = await generateCode(brdKey, additionalInstructions);
      console.log("Generate code response:", generateResponse);
      
      if (generateResponse.code) {
        setGeneratedCode(generateResponse.code);
        setOutput(generateResponse.output || 'Code generated successfully');
      } else {
        throw new Error("No code received from the server");
      }
    } catch (error) {
      console.error('Error processing BRD:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from server. Please try again.');
      } else {
        setError(`Failed to process BRD: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log("Executing code...");
      const executeResponse = await executeCode(generatedCode, output);
      console.log("Execute code response:", executeResponse);
      setOutput(executeResponse.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setError(`Failed to execute code: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="agent-interface">
      <h2>Agent Interface</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Select existing BRD:
            <select value={selectedBRD} onChange={handleBRDSelection}>
              <option value="">-- Select a BRD --</option>
              {existingBRDs.map(brd => (
                <option key={brd.key} value={brd.key}>{brd.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Or upload a new BRD:
            <input type="file" onChange={handleFileUpload} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Additional Instructions:
            <textarea
              value={additionalInstructions}
              onChange={handleAdditionalInstructions}
              placeholder="Provide additional instructions or test cases"
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading || (!selectedBRD && !file)}>
          {isLoading ? 'Processing...' : 'Generate Code'}
        </button>
      </form>
      {generatedCode && (
        <div className="generated-code">
          <h3>Generated Code:</h3>
          <pre>{generatedCode}</pre>
        </div>
      )}
      {output && (
        <div className="output">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
      <button onClick={handleExecute} disabled={!generatedCode || isLoading}>
        Execute Code
      </button>
    </div>
  );
};

export default AgentInterface;