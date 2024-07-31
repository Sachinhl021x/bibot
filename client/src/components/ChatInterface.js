import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    try {
      const response = await axios.post('/api/chat', { message: inputMessage });
      const botResponse = {
        content: response.data.message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;