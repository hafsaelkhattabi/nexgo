const mongoose = require("mongoose");
const bcrypt = require("mongoose-bcrypt"); // Plugin that auto hashes passwords

const DeliverySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true,
    bcrypt: true // Automatically hashed by mongoose-bcrypt
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  vehicleType: { 
    type: String, 
    required: true, 
    enum: ['car', 'motorcycle', 'bicycle'], 
    default: 'car' 
  }
}, { timestamps: true });

// Attach the bcrypt plugin
DeliverySchema.plugin(bcrypt);

// Optional: pre-save hook if you need custom logic
DeliverySchema.pre('save', function(next) {
  // Example custom logic can go here
  next();
});

// Add method to compare passwords (uses plugin's verifyPassword)
DeliverySchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    this.verifyPassword(candidatePassword, function(err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

// ✅ Export the model
module.exports = mongoose.model("Delivery", DeliverySchema);
