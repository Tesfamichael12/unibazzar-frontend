import React, { useState, useEffect } from "react";
import Message from "./Message";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    setMessages([
      { sender: "Alice", content: "Hi there!", timestamp: "10:30 AM" },
      { sender: "Bob", content: "Hello, how are you?", timestamp: "10:32 AM" },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      sender: "You",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 border border-gray-300 rounded-lg flex flex-col h-96 shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
