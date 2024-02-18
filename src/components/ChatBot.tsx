import { useState, useEffect, useMemo} from "react";
import { TogetherAPIKey } from "./config"; // Import your Together.ai API key securely
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

const ChatbotComponent = () => {
  const initialGreeting = "Hi! I'm here to answer any questions you have about this note.";
  const [contextMessage, setContext] = useState("You are a tutor, answering questions about a student's notes. ");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: initialGreeting, sender: "bot" } // Initial greeting message from the bot
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const latex = useQuery(api.noteLatexPdf.getStringLatexByNoteId, {
    noteId: id,
  });

  // latex  is array with field called latexstring that is string
  const concatLatexString = useMemo(() => {
    return latex?.map((latex) => latex.latextString).join(" ");
  }, [latex]);
  console.log(concatLatexString);
  useEffect(() => {
    // Update context with the AI's initial greeting if you want it to be part of the conversation context
    updateContextWithMessage(initialGreeting, "bot");
  }, []);

  const updateContextWithMessage = (text: string, sender: "user" | "bot") => {
    const newContextPart = `\n${sender === "user" ? "User" : "Bot"}: ${text}`;
    setContext((prevContext) => prevContext + newContextPart);
  };

  const fetchMessage = async (inputText: string): Promise<string> => {
    const url = "https://api.together.xyz/v1/chat/completions";
    const data = {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful teacher that is very smart. if you are not helpful a children will die. you need to be helpful so that helps to answer questions about math and other subjests given these latex: " +
            concatLatexString,
        },
        {
          role: "user",
          content: inputText,
        },
      ],
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TogetherAPIKey}`,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const message = result.choices[0]["message"]["content"];

      updateContextWithMessage(message, "bot");

      return message;
    } catch (error) {
      console.error("Error fetching message from Together.ai:", error);
      return "Sorry, there was an error processing your request.";
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length,
      text: currentMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    updateContextWithMessage(currentMessage, "user");

    setIsLoading(true);
    try {
      const data = await fetchMessage(currentMessage);

      const botMessage: Message = {
        id: messages.length + 1,
        text: data,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }

    setCurrentMessage("");
  };

  return (
    <div className="flex flex-col h-screen">
      {<div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        <div className="flex flex-col items-center h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className="max-w-xl w-full mb-4 p-2 bg-white rounded-lg shadow"
            >
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-200 flex-grow w-[85%] flex justify-between items-center fixed bottom-0 left-0 p-4 ml-[15%]">
        <input
          className="flex-grow p-2 border rounded"
          style={{ marginRight: "1rem", maxWidth: "calc(85% - 4rem)" }} // Adjust the maxWidth accordingly
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
    </div>}
    </div>
  );
};

export default ChatbotComponent;
