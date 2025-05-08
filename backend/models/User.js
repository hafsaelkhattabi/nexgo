
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: { type: String, unique: true },
//   password: String,
//   name: String,
//   role: { type: String, enum: ["restaurant", "delivery"] },
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ["user", "restaurant", "admin", "delivery", "customer"],
    default: "customer" // Changed default to customer based on your registration form
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Optional fields that might be useful
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'US' }
  },
  profileImage: {
    type: String
  },
  // For account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);