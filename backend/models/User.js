
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: { type: String, unique: true },
//   password: String,
//   name: String,
//   role: { type: String, enum: ["restaurant", "delivery"] },
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ["user", "restaurant", "admin", "delivery"],
    default: "user"
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);