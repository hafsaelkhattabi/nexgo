const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true }, // restaurantId, deliveryId, or customerId
  recipientType: { type: String, enum: ["restaurant", "delivery", "customer"], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
