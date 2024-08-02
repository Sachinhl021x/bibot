import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/api';
import './ChatInterface.css';

const ChatInterface = ({ selectedModel, isRagEnabled }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = { type: 'user', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log(`Sending message: model=${selectedModel}, useRag=${isRagEnabled}, message="${inputMessage}"`);
      const response = await sendChatMessage(inputMessage, selectedModel, isRagEnabled);
      console.log("Received response:", response);

      const aiMessage = { 
        type: 'ai', 
        content: response.response,
        context: isRagEnabled ? response.context : null
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { type: 'error', content: 'Failed to get response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <p>{message.content}</p>
            {message.context && (
              <div className="context">
                <h4>Relevant Context:</h4>
                <p>{message.context}</p>
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="message loading">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;