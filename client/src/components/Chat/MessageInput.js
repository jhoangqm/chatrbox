import React, { useState } from "react";

const MessageInput = ({ handleSendMessage, recipient }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    handleSendMessage(message, recipient);
    setMessage(""); // Clear message input
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
        style={{ flex: 1, padding: "10px", fontSize: "16px" }} // Full width input
      />
      <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
