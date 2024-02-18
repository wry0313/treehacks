import React, { useState, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const ChatbotComponent = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: Message = {
      id: messages.length,
      text: currentMessage,
      sender: 'user',
    };

    // Add user message to conversation
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      // Substitute this URL with your API endpoint
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include your API key or other authentication headers as required
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 1,
        text: data.reply, // Adjust according to the structure of your API response
        sender: 'bot',
      };

      // Add bot response to conversation
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }

    // Clear input field
    setCurrentMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <p key={message.id}><strong>{message.sender}:</strong> {message.text}</p>
        ))}
      </div>
      <input
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} disabled={isLoading}>
        Send
      </button>
    </div>
  );
};

export default ChatbotComponent;
