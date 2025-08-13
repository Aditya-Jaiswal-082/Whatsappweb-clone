import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_BASE_URL = "http://localhost:5000/api"; // Change this to your backend URL when deployed

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const messagesEndRef = useRef(null);

  // Fetch conversation list from backend
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await axios.get(`${API_BASE_URL}/conversations`);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    }
    fetchConversations();
  }, []);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;
    async function fetchMessages() {
      try {
        const res = await axios.get(`${API_BASE_URL}/messages/${selectedChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }
    fetchMessages();
  }, [selectedChat]);

  // Scroll chat window to bottom on messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message and refresh messages
  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedChat) return;

    try {
      await axios.post(`${API_BASE_URL}/messages`, {
        wa_id: selectedChat._id,
        name: selectedChat.name,
        from: "918329446654", // Your WhatsApp API/user number
        to: selectedChat._id,
        text: text.trim(),
      });
      const res = await axios.get(`${API_BASE_URL}/messages/${selectedChat._id}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="wa-app">
       <div className="wa-header">
        {/* <img src="/whatsapp-logo.png" alt="WhatsApp Logo" className="wa-logo" /> */}
        <span className="wa-title">WhatsApp</span>
      </div>
      <div className="main-area">
        <Sidebar
          conversations={conversations}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <ChatWindow
          selectedChat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          selfNumber="918329446654" // Your own sender ID
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
}

export default App;
