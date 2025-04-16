const express = require("express");
const Restaurant = require("../models/Restaurant");
const uploadRoute = require("./uploadRoutes");

const router = express.Router();

// Add Restaurant with File Uploads
router.post("/restaurants", uploadRoute, async (req, res) => {
  try {
    const { name, address, cuisine, contact } = req.body;
    
    // Handle the image file
    const imagePath = req.files && req.files["image"] ? 
                      `/uploads/${req.files["image"][0].filename}` : 
                      "/placeholder.svg";
    
    const newRestaurant = new Restaurant({
      name,
      address,
      cuisine,
      contact,
      image: imagePath
    });
    
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ message: "Error adding restaurant", error: error.message });
  }
});

// Get All Restaurants
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error: error.message });
  }
});

// Get Restaurant by ID
router.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error: error.message });
  }
});

module.exports = router;