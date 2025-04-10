const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// Fetch restaurant menu
exports.getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a menu item
exports.addMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await MenuItem.findByIdAndDelete(itemId);
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch restaurant orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order and notify restaurant
exports.createOrder = async (req, res) => {
  try {
    const { customerName, restaurantId, items } = req.body;
    const order = await Order.create({ customerName, restaurantId, items, status: "Pending" });

    // Create a notification for the restaurant
    await Notification.create({
      recipientType: "restaurant",
      recipientId: restaurantId,
      message: `New order from ${customerName}`,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status and notify customer
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, customerId } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });

    // Notify customer about order status update
    await Notification.create({
      recipientType: "customer",
      recipientId: customerId,
      message: `Your order status has been updated to: ${status}`,
    });

    res.json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch restaurant notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientType: "restaurant",
      recipientId: req.params.restaurantId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


