// socketEvents.js
const User = require("./models/User");
const Message = require("./models/Message");

const registerUser = async (socket, username) => {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // User exists, fetch chat history
      existingUser.socketId = socket.id;
      existingUser.online = true;
      await existingUser.save();
      console.log(`Updated ${username} with new socket ID: ${socket.id}`);
      console.log(`User ${existingUser.username} is now online.`);

      const chatHistory = await Message.find({
        $or: [{ sender: username }, { recipient: username }],
      }).sort({ timestamp: 1 });

      // Send chat history to the client
      socket.emit("chatHistory", chatHistory);
      console.log(`Chat history sent for ${username}`);
    } else {
      // New user, save them
      const newUser = new User({ username, socketId: socket.id });
      await newUser.save();
      console.log(`${username} registered with socket ID: ${socket.id}`);
    }

    // Emit updated user list to all clients
    const users = await User.find({});
    const userList = users.map((user) => ({
      username: user.username,
      online: user.online,
    }));
    socket.emit("userList", userList);
  } catch (err) {
    console.error(err);
    socket.emit("error", "Something went wrong. Please try again.");
  }
};

const sendMessage = async (socket, { sender, recipient, message }) => {
  try {
    // Save message in MongoDB
    const newMessage = new Message({ sender, recipient, message });
    await newMessage.save();
    console.log("Message saved:", newMessage);

    // Emit the message to the recipient
    const recipientUser = await User.findOne({ username: recipient });
    if (recipientUser && recipientUser.socketId) {
      socket
        .to(recipientUser.socketId)
        .emit("receiveMessage", { sender, message });
      console.log(`Message sent to ${recipient}: ${message}`);
    } else {
      console.log(`Recipient ${recipient} not connected or not found.`);
    }

    // Emit the message back to the sender
    socket.emit("receiveMessage", { sender, message });
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

const handleLogout = async (socket, username) => {
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { online: false, socketId: null }
    );
    if (user) {
      console.log(`${user.username} has logged out.`);
      console.log(`${user.username} is now offline.`);
    }

    // Emit updated user list to all clients
    const users = await User.find({});
    const userList = users.map((user) => ({
      username: user.username,
      online: user.online,
    }));
    socket.emit("userList", userList);
  } catch (err) {
    console.error("Error handling logout:", err);
  }
};

const handleDisconnect = async (socket) => {
  console.log(`User disconnected: ${socket.id}`);
  // Update user status to offline
  const user = await User.findOneAndUpdate(
    { socketId: socket.id },
    { online: false, socketId: null }
  );

  if (user) {
    console.log(`${user.username} is now offline.`);
  }

  // Emit updated user list to all clients
  const users = await User.find({});
  const userList = users.map((user) => ({
    username: user.username,
    online: user.online,
  }));
  socket.emit("userList", userList);
};

module.exports = {
  registerUser,
  sendMessage,
  handleLogout,
  handleDisconnect,
};
