const express = require("express");
const Restaurant = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", authMiddleware(["restaurant"]), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.userId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant details", error });
  }
});

module.exports = router;