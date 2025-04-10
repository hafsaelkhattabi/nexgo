const express = require("express");
const { placeOrder, getOrders } = require("../controllers/CustomerController");

const router = express.Router();

router.post("/order", placeOrder);
router.get("/orders/:customerId", getOrders);

module.exports = router;
