const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// POST - Place a new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Create notification for restaurant
    const restaurantNotification = new Notification({
      recipient: order.restaurantId,
      recipientType: "restaurant",
      message: `New order #${order._id.toString().slice(-6)} received from ${order.customerName}`,
      relatedOrderId: order._id
    });
    await restaurantNotification.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - All orders for a specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - All orders for a specific restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH - Restaurant updates order status
router.patch('/orders/:orderId/restaurant-update', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    const customerNotification = new Notification({
      recipient: order.customer,
      recipientType: "customer",
      message: `Your order #${orderId.slice(-6)} has been ${status.toLowerCase()}`,
      relatedOrderId: order._id
    });
    await customerNotification.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

// GET - Orders ready for pickup (for delivery)
router.get('/delivery/available-orders', async (req, res) => {
  try {
    const orders = await Order.find({ deliveryId: null, status: "Ready for Pickup" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available orders" });
  }
});

// PATCH - Delivery person accepts order
router.patch('/orders/:orderId/delivery-accept', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryId, deliveryName } = req.body;

    const checkOrder = await Order.findById(orderId);
    if (checkOrder.deliveryId) {
      return res.status(400).json({ message: "Order has already been accepted" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryId, deliveryName, status: "On The Way" },
      { new: true }
    );

    const restaurantNotification = new Notification({
      recipient: order.restaurantId,
      recipientType: "restaurant",
      message: `Order #${orderId.slice(-6)} has been picked up by ${deliveryName}`,
      relatedOrderId: order._id
    });
    await restaurantNotification.save();

    const customerNotification = new Notification({
      recipient: order.customer,
      recipientType: "customer",
      message: `Your order #${orderId.slice(-6)} is on the way with ${deliveryName}`,
      relatedOrderId: order._id
    });
    await customerNotification.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error accepting order" });
  }
});

// PATCH - Mark order as delivered
router.patch('/orders/:orderId/mark-delivered', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(orderId, { status: "Delivered" }, { new: true });

    const customerNotification = new Notification({
      recipient: order.customer,
      recipientType: "customer",
      message: `Your order #${orderId.slice(-6)} has been delivered. Enjoy your meal!`,
      relatedOrderId: order._id
    });
    await customerNotification.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error marking order as delivered" });
  }
});

// GET - Pending orders (for delivery)
router.get('/delivery/pending-orders', async (req, res) => {
  try {
    const orders = await Order.find({ deliveryId: null, status: "Pending" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending orders" });
  }
});

// PATCH - Delivery accepts order (legacy route)
router.patch('/orders/:orderId/accept', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryId } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { deliveryId, status: "Accepted" }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error accepting order" });
  }
});

// PATCH - Generic update to order status
router.patch('/orders/:orderId/update-status', async (req, res) => {
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
