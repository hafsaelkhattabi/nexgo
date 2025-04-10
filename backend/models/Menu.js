const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: String,
  image: String,
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);