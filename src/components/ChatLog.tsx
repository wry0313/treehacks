import React, { useState } from 'react';
import { TogetherAPIKey } from './config'; // Import your Together.ai API key securely

// Define a type for individual chat messages
type Message = {
  text: string;
  user: 'user' | 'bot';
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage: Message = { text: input, user: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    console.log(userMessage);

    const botResponse = await fetchMessage(input);
    const botMessage: Message = { text: botResponse, user: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    setInput(''); // Clear input field after sending a message
  };

  const fetchMessage = async (inputText: string): Promise<string> => {
    const url = 'https://api.together.xyz/v1/chat/completions';
    const data = {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', 
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: inputText
        }
      ]
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TogetherAPIKey}` // Use your secure API key
      },
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const message = result.choices[0]['message']['content'];

      console.log(message);

      return message;
    } catch (error) {
      console.error('Error fetching message from Together.ai:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  return (
    <div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default Chat;
