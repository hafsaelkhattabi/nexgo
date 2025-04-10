const Order = require("../models/Order");
const Notification = require("../models/Notification");

// Fetch pending orders
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Pending" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status and notify delivery personnel
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, deliveryPersonId } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });

    // Notify delivery personnel
    if (status === "Ready for Delivery") {
      await Notification.create({
        recipientType: "delivery",
        recipientId: deliveryPersonId,
        message: `New delivery request for order ${orderId}`,
      });
    }

    res.json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
