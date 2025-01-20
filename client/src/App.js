import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    axios.get("https://chatbot-kt7h.onrender.com/api/messages")
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    axios.post("https://chatbot-kt7h.onrender.com/api/messages", { user_message: userMessage })
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setUserMessage(""); 
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const handleDeleteMessage = (id) => {
    axios.delete(`https://chatbot-kt7h.onrender.com/api/messages/${id}`)
      .then(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
      })
      .catch((error) => console.error("Error deleting message:", error));
  };

  
  return (
    <div className="app">
      <h1>Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <p><strong>User:</strong> {msg.user_message}</p>
            <p><strong>Bot:</strong> {msg.bot_response}</p>
            <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
