const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get orders for a customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Failed to fetch customer orders', error: error.message });
  }
});

// Get orders for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant orders', error: error.message });
  }
});

// Get orders available for delivery
router.get('/delivery', async (req, res) => {
  try {
    const orders = await Order.find({ 
      status: 'ready_for_delivery',
      acceptedByDeliveryId: { $exists: false }
    }).sort({ createdAt: 1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching delivery orders:', error);
    res.status(500).json({ message: 'Failed to fetch delivery orders', error: error.message });
  }
});

// Get orders for a specific delivery driver
router.get('/delivery/:driverId', async (req, res) => {
  try {
    const orders = await Order.find({ 
      acceptedByDeliveryId: req.params.driverId,
      status: { $in: ['accepted_by_delivery', 'in_delivery'] }
    }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching driver orders:', error);
    res.status(500).json({ message: 'Failed to fetch driver orders', error: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { restaurantId, customerId, customerName, customerAddress, customerPhone, items, totalAmount } = req.body;
    
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Create the order with all required fields
    const order = new Order({
      customerId,
      customerName,
      customer: customerId, // Required by schema
      customerAddress,
      address: customerAddress, // Required by schema
      customerPhone,
      restaurantId,
      restaurant: restaurantId, // MongoDB ObjectId reference
      restaurantName: restaurant.name,
      items,
      totalAmount,
      totalPrice: totalAmount, // Required by schema
      status: 'pending',
      statusUpdates: [{ status: 'pending', timestamp: new Date() }]
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, ...additionalData } = req.body;
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update the order status and add to status history
    order.status = status;
    order.statusUpdates.push({
      status,
      timestamp: new Date(),
      note: additionalData.note
    });
    
    // Add any additional data to the order
    Object.assign(order, additionalData);
    
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ message: 'Failed to update order status', error: error.message });
  }
});

// Cancel an order
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { customerId } = req.body;
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if customer owns this order
    if (order.customerId !== customerId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Only allow cancellation if the order is pending or accepted by restaurant
    if (!['pending', 'accepted_by_restaurant'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel order in current status', 
        currentStatus: order.status 
      });
    }
    
    // Update the order status
    order.status = 'cancelled';
    order.statusUpdates.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Cancelled by customer'
    });
    
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(400).json({ message: 'Failed to cancel order', error: error.message });
  }
});

module.exports = router;
