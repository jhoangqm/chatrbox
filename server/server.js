// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  registerUser,
  sendMessage,
  handleLogout,
  handleDisconnect,
} = require("./socketHandlers");
// helper that will retry the operation 3 times if it fails.
const retryOperation = require("../server/utils/retryMechanism");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// MongoDB connection
const connectToMongoDB = async () => {
  await retryOperation(() =>
    mongoose.connect("mongodb://localhost:27017/chatapp")
  );
  console.log("MongoDB connected");
};

connectToMongoDB().catch((err) =>
  console.log("MongoDB connection error:", err)
);

// Handle user connection
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("registerUser", async (username) => {
    try {
      await retryOperation(async () => {
        await registerUser(socket, username);
      });
    } catch (err) {
      console.error(err);
      socket.emit(
        "error",
        "Something went wrong during registration. Please try again."
      );
    }
  });

  socket.on("sendMessage", async (data) => {
    try {
      await retryOperation(async () => {
        await sendMessage(socket, data);
      });
    } catch (err) {
      console.error(err);
      socket.emit("error", "Could not send message. Please try again.");
    }
  });

  socket.on("logout", async (username) => {
    try {
      await retryOperation(async () => {
        await handleLogout(socket, username);
      });
    } catch (err) {
      console.error(err);
      socket.emit("error", "Could not log out. Please try again.");
    }
  });

  socket.on("disconnect", async () => {
    try {
      await handleDisconnect(socket);
    } catch (err) {
      console.error("Error handling disconnect:", err);
    }
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
