const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer: { type: String, required: true }, // Customer ID
  customerName: { type: String, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  restaurantName: { type: String, required: true },
  deliveryId: { type: String, default: null }, // Delivery person ID
  deliveryName: { type: String, default: null },
  items: [{ 
    menuItemId: String,
    name: String, 
    price: Number,
    quantity: Number
  }],
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Preparing", "Ready for Pickup", "On The Way", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
  totalPrice: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
