// const mongoose = require('mongoose');

// const restaurantSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   cuisine: {
//     type: String,
//     required: true
//   },
//   contact: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     default: '/placeholder.svg'
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Restaurant', restaurantSchema);

const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: "/placeholder.svg"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);