import React from "react";

const ChatWindow = ({ messages, activeRecipient, username }) => {
  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <div style={{ listStyleType: "none", padding: 0 }}>
        {(messages[activeRecipient] || []).map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              display: "flex",
              justifyContent:
                msg.sender === username ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "60%",
                backgroundColor:
                  msg.sender === username ? "#d1f1ff" : "#f1f1f1",
                textAlign: msg.sender === username ? "right" : "left",
                wordWrap: "break-word",
              }}
            >
              <strong>{msg.sender !== username && `${msg.sender}: `}</strong>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
