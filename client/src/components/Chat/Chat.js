import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import UserList from "./UserList";
import ChatTabs from "./ChatTabs";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

// Initialize socket connection to the server
const socket = io("http://localhost:5000");

const Chat = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [openChatTabs, setOpenChatTabs] = useState(() => {
    return JSON.parse(localStorage.getItem("openChatTabs")) || [];
  });
  const [activeRecipient, setActiveRecipient] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Listen for updates to the user list
    socket.on("userList", (users) => setUserList(users));

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      // Update messages state with new messages from the sender
      setMessages((prevMessages) => ({
        ...prevMessages,
        [data.sender]: [
          ...(prevMessages[data.sender] || []),
          { sender: data.sender, message: data.message },
        ],
      }));
    });

    // Listen for chat history when connecting
    socket.on("chatHistory", (chatHistory) => {
      const history = chatHistory.reduce((acc, msg) => {
        // Determine the recipient for each message
        const recipient = msg.sender === username ? msg.recipient : msg.sender;
        acc[recipient] = [
          ...(acc[recipient] || []),
          { sender: msg.sender, message: msg.message },
        ];
        return acc;
      }, {});
      setMessages(history);
    });

    // Cleanup function to remove listeners when component unmounts
    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
      socket.off("userList");
    };
  }, [username]);

  // Function to handle when a recipient is clicked
  const handleRecipientClick = (recipient) => {
    setActiveRecipient(recipient);
    // Update open chat tabs if the recipient isn't already open
    if (!openChatTabs.includes(recipient)) {
      const updatedTabs = [...openChatTabs, recipient];
      setOpenChatTabs(updatedTabs);
      localStorage.setItem("openChatTabs", JSON.stringify(updatedTabs));
    }
  };

  // Function to handle closing a chat tab
  // const handleCloseChatTab = (recipient) => {
  //   const updatedTabs = openChatTabs.filter((tab) => tab !== recipient);
  //   setOpenChatTabs(updatedTabs);
  //   localStorage.setItem("openChatTabs", JSON.stringify(updatedTabs));
  //   if (activeRecipient === recipient) setActiveRecipient("");
  // };

  // Function to handle sending a message
  const handleSendMessage = (message, recipient) => {
    if (message && recipient) {
      socket.emit("sendMessage", {
        sender: username,
        recipient,
        message,
      });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [recipient]: [
          ...(prevMessages[recipient] || []),
          { sender: username, message },
        ],
      }));
    }
  };

  // Function to handle user connection
  const handleConnect = () => {
    if (username) {
      localStorage.setItem("username", username);
      socket.emit("registerUser", username); // Notify server of new user
      setConnected(true);
    }
  };

  const handleLogout = () => {
    socket.emit("logout", username); // Emit logout event to server
    localStorage.removeItem("username");
    setUsername("");
    setConnected(false);
    setMessages({});
    setOpenChatTabs([]);
    setUserList([]);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        borderTop: "1px solid #ccc",
      }}
    >
      {!connected ? (
        <div>
          <h2>Enter your name to connect:</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button onClick={handleConnect}>Connect</button>
        </div>
      ) : (
        <>
          <div
            style={{
              width: "300px",
              borderRight: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Chats</div>
            <input
              type="text"
              placeholder="Search users..."
              style={{
                width: "95%",
                padding: "5px",
                marginTop: "5px",
                marginBottom: "5px",
              }}
              value={""}
            />
            <UserList
              userList={userList}
              username={username}
              activeRecipient={activeRecipient}
              handleRecipientClick={handleRecipientClick}
            />
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // Ensure space is allocated between ChatWindow and MessageInput
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: "auto", // ChatWindow should be scrollable
              }}
            >
              {activeRecipient && (
                <ChatWindow
                  messages={messages}
                  activeRecipient={activeRecipient}
                  username={username}
                />
              )}
            </div>
            {activeRecipient && (
              <div style={{ borderTop: "1px solid #ccc", padding: "10px" }}>
                <MessageInput
                  handleSendMessage={handleSendMessage}
                  recipient={activeRecipient}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
