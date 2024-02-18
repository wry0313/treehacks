import React, { useState, useEffect } from 'react';
import { TogetherAPIKey } from './config'; // Import your Together.ai API key securely

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const ChatbotComponent = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const data = await fetchMessage(currentMessage);

      // const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 1,
        text: data,
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
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        <div className="flex flex-col items-center h-full">
          {messages.map((message) => (
            <div key={message.id} className="max-w-xl w-full mb-4 p-2 bg-white rounded-lg shadow">
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-200 flex-grow w-[85%] flex justify-between items-center fixed bottom-0 left-0 p-4 ml-[15%]">
        <input
          className="flex-grow p-2 border rounded"
          style={{ marginRight: '1rem', maxWidth: 'calc(85% - 4rem)' }} // Adjust the maxWidth accordingly
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotComponent;
