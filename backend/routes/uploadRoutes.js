const express = require("express");
const multer = require("multer");
const path = require("path");
const Restaurant = require("../models/Restaurant"); 

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDFs and images are allowed."), false);
  }
};

// Initialize Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Route to Handle Restaurant File Uploads and Save Data to DB
router.post("/restaurants", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "menu", maxCount: 1 },
]), async (req, res) => {
  try {
    // Check if files are uploaded is a required section 
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    const fileUrls = {};
    if (req.files["image"]) {
      fileUrls.image = `/uploads/${req.files["image"][0].filename}`;
    }
    if (req.files["menu"]) {
      fileUrls.menu = `/uploads/${req.files["menu"][0].filename}`;
    }

    // Create a new restaurant entry in the database
    const newRestaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      cuisine: req.body.cuisine,
      contact: req.body.contact,
      image: fileUrls.image,
      menu: fileUrls.menu,
    });

    // Save the restaurant data in my database
    await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant added successfully!",
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ message: "Error adding restaurant!" });
  }
});

module.exports = router;
