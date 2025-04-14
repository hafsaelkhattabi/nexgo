const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  cuisineType: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  imageUrl: {
    type: String,
    default: '/placeholder.svg'
  },
  openingHours: {
    type: String,
    default: '9:00 AM - 10:00 PM'
  },
  deliveryTime: {
    type: String,
    default: '30-45 min'
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

