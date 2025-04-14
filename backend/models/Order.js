const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderStatusUpdateSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      'pending', 
      'accepted_by_restaurant', 
      'rejected_by_restaurant', 
      'ready_for_delivery', 
      'accepted_by_delivery', 
      'in_delivery', 
      'delivered', 
      'cancelled'
    ],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending', 
      'accepted_by_restaurant', 
      'rejected_by_restaurant', 
      'ready_for_delivery', 
      'accepted_by_delivery', 
      'in_delivery', 
      'delivered', 
      'cancelled'
    ],
    default: 'pending'
  },
  statusUpdates: [orderStatusUpdateSchema],
  acceptedByDeliveryId: String,
  deliveryName: String,
  estimatedDeliveryTime: String
}, {
  timestamps: true
});

// Add pre-save hook to ensure restaurantId is a string
orderSchema.pre('save', function(next) {
  if (this.restaurant && mongoose.Types.ObjectId.isValid(this.restaurant)) {
    this.restaurantId = this.restaurant.toString();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);