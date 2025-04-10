const express = require("express");
const Restaurant = require("../models/Restaurant");
const uploadRoute = require("./uploadRoutes"); 

const router = express.Router();

// Add Restaurant with File Uploads
router.post("/", uploadRoute, async (req, res) => {
  try {
    const { name, address, cuisine, contact } = req.body;
    // handle the main image of the new Restaurant
    const imageUrl = req.files["image"] ? `/uploads/${req.files["image"][0].filename}` : ""; 
    // handle the menu
    const menuUrl = req.files["menu"] ? `/uploads/${req.files["menu"][0].filename}` : ""; 

    const newRestaurant = new Restaurant({
      name,
      address,
      cuisine,
      contact,
      image: imageUrl,
      menu: menuUrl,
    });
    
    await newRestaurant.save();
    res.status(201).json(newRestaurant);  // add the new restaurant in my database
  } catch (error) {
    res.status(500).json({ message: "Error adding restaurant", error });
  }
});

// Get Restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
});

module.exports = router;