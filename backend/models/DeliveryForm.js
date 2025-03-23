const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Delivery", DeliverySchema);
