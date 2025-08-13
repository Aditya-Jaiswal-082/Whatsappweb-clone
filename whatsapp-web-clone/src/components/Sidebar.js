import React from "react";

export default function Sidebar({ conversations, selectedChat, setSelectedChat }) {
  return (
    <div className="sidebar">
      <header className="sidebar-header">
        <h2>WhatsApp</h2>
      </header>
      <div className="conversation-list">
        {conversations.map(conv => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          return (
            <div
              key={conv._id}
              className={`conversation-item ${selectedChat?._id === conv._id ? "selected" : ""}`}
              onClick={() => setSelectedChat(conv)}
            >
              <div className="avatar">{conv.name[0]}</div>
              <div className="conversation-info">
                <div className="name">{conv.name}</div>
                <div className="last-message" title={lastMsg?.text}>
                  {lastMsg?.text?.slice(0, 35)}
                </div>
              </div>
              <div className="conversation-meta">
                <div className="time">
                  {lastMsg
                    ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
