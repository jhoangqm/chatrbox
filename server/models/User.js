// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  socketId: { type: String, required: true },
  online: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", userSchema);
