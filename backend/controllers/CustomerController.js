const Order = require("../models/Order");
const Notification = require("../models/Notification");

exports.placeOrder = async (req, res) => {
  try {
    const { customerId, restaurantId, items, address } = req.body;
    const order = await Order.create({ customerId, restaurantId, items, address });

    // Create a notification for the restaurant
    await Notification.create({
      userId: restaurantId,
      message: `New order received!`,
      type: "order",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Error placing order" });
  }
};

exports.getOrders = async (req, res) => {
    try {
      const orders = await Order.find({ customerId: req.params.customerId });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving orders" });
    }
};
