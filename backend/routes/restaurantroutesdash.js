const express = require("express");
const {
  getMenu,
  addMenuItem,
  deleteMenuItem,
  getOrders,
  createOrder,
  updateOrderStatus,
  getNotifications,
} = require("../controllers/restaurantController");

const router = express.Router();

router.get("/menu/:restaurantId", getMenu);
router.post("/menu", addMenuItem);
router.delete("/menu/:itemId", deleteMenuItem);

router.get("/orders/:restaurantId", getOrders);
router.post("/orders", createOrder);
router.post("/order-status", updateOrderStatus);

router.get("/notifications/:restaurantId", getNotifications);

module.exports = router;
