import React from "react";

const ChatTabs = ({
  openChatTabs,
  activeRecipient,
  setActiveRecipient,
  handleCloseChatTab,
}) => {
  return (
    <div>
      <h3>Open Chats:</h3>
      <ul>
        {openChatTabs.map((tab, index) => (
          <li key={index}>
            <span
              onClick={() => setActiveRecipient(tab)}
              style={{
                cursor: "pointer",
                fontWeight: activeRecipient === tab ? "bold" : "normal",
              }}
            >
              {tab}
            </span>
            <button onClick={() => handleCloseChatTab(tab)}>Close</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatTabs;
