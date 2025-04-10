const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  items: [{ name: String, price: Number }],
  address: String,
  status: { type: String, enum: ["Pending", "Accepted", "Preparing", "On The Way", "Delivered"], default: "Pending" },
});

module.exports = mongoose.model("Order", OrderSchema);
