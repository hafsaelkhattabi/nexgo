const express = require('express');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Count restaurants, pending orders, and completed orders
    const restaurantCount = await Restaurant.countDocuments();
    const pendingDeliveries = await Order.countDocuments({ status: { $in: ['ready_for_delivery', 'accepted_by_delivery', 'in_delivery'] } });
    const completedDeliveries = await Order.countDocuments({ status: 'delivered' });
    const totalOrders = await Order.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get popular restaurants (by order count)
    const popularRestaurants = await Restaurant.find()
      .sort({ totalOrders: -1 })
      .limit(5);

    res.status(200).json({
      restaurantCount,
      pendingDeliveries,
      completedDeliveries,
      totalOrders,
      recentOrders,
      popularRestaurants
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

module.exports = router;