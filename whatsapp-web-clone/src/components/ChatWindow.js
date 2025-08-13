import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ selectedChat, messages, onSendMessage, selfNumber }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        <h3>{selectedChat.name}</h3>
        <small>{selectedChat._id}</small>
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
