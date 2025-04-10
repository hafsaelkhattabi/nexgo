const express = require("express");
const { getPendingOrders, updateOrderStatus } = require("../controllers/deliveryController");

const router = express.Router();

router.get("/pending-orders", getPendingOrders);
router.post("/update-order", updateOrderStatus);

module.exports = router;
