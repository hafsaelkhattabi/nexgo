
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  name: String,
  role: { type: String, enum: ["restaurant", "delivery"] },
});

module.exports = mongoose.model("User", userSchema);
