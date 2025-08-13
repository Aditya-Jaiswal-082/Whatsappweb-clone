import React from "react";

export default function MessageBubble({ msg, selfNumber }) {
  const isSelf = msg.from === selfNumber;

  const statusIcons = {
    sent: "✓",
    delivered: "✓✓",
    read: "✓✓✓"
  };

  return (
    <div className={`message-bubble ${isSelf ? "self" : "other"}`}>
      <div className="bubble-text">
        {msg.text}
        <span className="message-meta">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {isSelf && statusIcons[msg.status] && (
            <span className="status-icon">{statusIcons[msg.status]}</span>
          )}
        </span>
      </div>
    </div>
  );
}
