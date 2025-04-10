// backend/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get notifications for a specific delivery person
router.get("/notifications/delivery/:deliveryId", async (req, res) => {
  try {
    const notifications = await Notification.find({ deliveryId: req.params.deliveryId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;


