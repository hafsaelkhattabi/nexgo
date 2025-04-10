const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");
const multer = require("multer");
const path = require("path");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get menu for a restaurant
router.get("/:restaurantId", async (req, res) => {
  try {
    const menu = await Menu.find({ restaurant: req.params.restaurantId });
    if (!menu || menu.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new menu item
router.post("/", upload.single("image"), async (req, res) => {
  try {

    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);

    const { name, price, description, restaurantId } = req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({ message: "Name, price, and restaurant ID are required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("Image path:", imagePath);

    const newItem = new Menu({
      name,
      price,
      description,
      restaurant: restaurantId,
      image: imagePath,
    });

    console.log("New item to save:", newItem);

    const savedItem = await newItem.save();
    
    console.log("Item saved successfully:", savedItem);

    res.status(201).json({ message: "Menu item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Failed to add menu item" });
  }
});

// Delete menu item
router.delete("/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
