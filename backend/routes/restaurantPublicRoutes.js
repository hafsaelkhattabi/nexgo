const express = require("express");
const Restaurant = require("../models/Restaurant");
const router = express.Router();

// GET /restaurants - Get all restaurants (public)
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ 
      success: true,
      data: restaurants 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching restaurants",
      error: error.message 
    });
  }
});

// GET /restaurants/:id - Get single restaurant (public)
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: "Restaurant not found" 
      });
    }
    res.json({ 
      success: true,
      data: restaurant 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching restaurant",
      error: error.message 
    });
  }
});

module.exports = router;