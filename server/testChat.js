const io = require("socket.io-client");

const socket1 = io("http://localhost:5000");
const socket2 = io("http://localhost:5000");

let user2Id;

socket1.on("connect", () => {
  console.log("User1 connected");
  socket1.emit("registerUser", "User1");

  // Wait until User2 is connected before sending a message
  socket2.on("connect", () => {
    console.log("User2 connected");
    socket2.emit("registerUser", "User2");

    // Send message to User2 after User2 is registered
    setTimeout(() => {
      socket1.emit("sendMessage", {
        recipientId: socket2.id,
        message: "Hello from User1!",
      });
    }, 500); // Adjust this timeout if necessary
  });
});

socket2.on("receiveMessage", (data) => {
  console.log(`Message received by User2: ${data.message}`);
});

socket1.on("receiveMessage", (data) => {
  console.log(`Message received by User1: ${data.message}`);
});
