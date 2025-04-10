const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  price: Number,
  image: String, // URL of the menu item image
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
