const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: String,
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
