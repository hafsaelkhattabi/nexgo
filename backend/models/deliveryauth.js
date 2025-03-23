const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "delivery" },
});

module.exports = mongoose.model("Delivery", deliverySchema);