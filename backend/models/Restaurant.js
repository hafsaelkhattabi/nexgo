const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  contact: { type: String, required: true },
  image: { type: String, required: true },  
  menu: { type: String, required: true },   
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
