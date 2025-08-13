import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

// Inline SVG components (same icons as Sidebar)
const VideoCallIcon = () => (
  <svg
    className="vc-ac-icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const AudioCallIcon = () => (
  <svg
    className="vc-ac-icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.62 10.79a15.091 15.091 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C11.85 20.43 3.57 12.15 3.57 3a1 1 0 0 1 1-1H8a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.01l-2.7 2.21z" />
  </svg>
);

export default function ChatWindow({ selectedChat, messages, onSendMessage, selfNumber, messagesEndRef }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  if (!selectedChat) {
    return <div className="chat-window empty">Select a conversation</div>;
  }

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="avatar">{selectedChat.name[0]}</div>
          <div className="contact-info">
            <h5>{selectedChat.name}</h5>
            <small>{selectedChat._id}</small>
          </div>
        </div>
        <div className="chat-header-right vc-ac-icons">
          <VideoCallIcon />
          <AudioCallIcon />
        </div>
      </div>
      <div className="chat-content">
        {messages.map((msg) => (
          <MessageBubble key={msg.id || msg._id} msg={msg} selfNumber={selfNumber} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button onClick={handleSend} aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  );
}
