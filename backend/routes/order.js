const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


// post all orders for a specific customer
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get all orders for a specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
      
    console.log("Fetching orders for customerId:", customerId);

    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET - All orders for a specific restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId })
                              .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending orders for delivery
router.get("/delivery/pending-orders", async (req, res) => {
  try {
    const orders = await Order.find({ deliveryId: null, status: "Pending" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending orders" });
  }
});

// Accept an order
router.patch("/orders/:orderId/accept", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryId } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryId, status: "Accepted" },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error accepting order" });
  }
});

// Update order status (e.g., Delivered)
router.patch("/orders/:orderId/update-status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

module.exports = router;
