import React from "react";
export default function SidebarSide({ conversations, selectedChat }) {
  return (
    <div className="sidebarside">
      <div className="chat-list">
        {conversations.map(conv => (
          <div
            key={conv.wa_id}
            className={`chat-list-item${selectedChat?.wa_id === conv.wa_id ? " selected" : ""}`}
          >
            <div className="avatar">{conv.name[0]}</div>
            <div className="chat-list-info">
              <div className="chat-name">{conv.name}</div>
              <div className="chat-last-msg">{conv.messages[conv.messages.length-1]?.text}</div>
            </div>
            {conv.unreadCount ? <div className="unread-badge">{conv.unreadCount}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
