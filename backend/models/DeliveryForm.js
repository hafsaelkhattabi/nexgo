const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  vehicleType: { type: String, required: true, enum: ['car', 'motorcycle', 'bicycle'], default: 'car' }
}, { timestamps: true });

module.exports = mongoose.model("Delivery", DeliverySchema);
