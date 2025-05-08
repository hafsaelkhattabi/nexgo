const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  addresses: [
    {
      title: {
        type: String,
        default: 'Home'
      },
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: 'US'
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    }
  ],
  paymentMethods: [
    {
      type: {
        type: String,
        enum: ['credit', 'debit', 'paypal'],
        required: true
      },
      lastFour: String,
      expiryDate: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  preferences: {
    // For personalization
    dietaryRestrictions: [String],
    cuisinePreferences: [String],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
CustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Customer', CustomerSchema);