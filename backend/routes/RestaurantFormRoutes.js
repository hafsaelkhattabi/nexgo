// const express = require("express");
// const Restaurant = require("../models/Restaurant");
// const uploadRoute = require("./uploadRoutes");

// const router = express.Router();

// // Add Restaurant with File Uploads
// router.post("/restaurants", uploadRoute, async (req, res) => {
//   try {
//     const { name, address, cuisine, contact } = req.body;
    
//     // Handle the image file
//     const imagePath = req.files && req.files["image"] ? 
//                       `/uploads/${req.files["image"][0].filename}` : 
//                       "/placeholder.svg";
    
//     const newRestaurant = new Restaurant({
//       name,
//       address,
//       cuisine,
//       contact,
//       image: imagePath
//     });
    
//     await newRestaurant.save();
//     res.status(201).json(newRestaurant);
//   } catch (error) {
//     console.error("Error adding restaurant:", error);
//     res.status(500).json({ message: "Error adding restaurant", error: error.message });
//   }
// });

// // Get All Restaurants
// router.get("/restaurants", async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find();
//     res.status(200).json(restaurants);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching restaurants", error: error.message });
//   }
// });

// // Get Restaurant by ID
// router.get("/restaurants/:id", async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findById(req.params.id);
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }
//     res.status(200).json(restaurant);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching restaurant", error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User"); // Assuming you have a User model
const uploadMiddleware = require("./uploadMiddleware");

const router = express.Router();

// Add Restaurant with File Uploads and User Registration
router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const { name, address, cuisine, contact, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Handle the image file
    const imagePath =
  req.files && req.files["image"] && req.files["image"][0]
    ? `/uploads/${req.files["image"][0].filename}`
    : "/placeholder.svg";
    
    // Create new restaurant
    const newRestaurant = new Restaurant({
      name,
      address,
      cuisine,
      contact,
      image: imagePath
    });
    
    // Save restaurant
    const savedRestaurant = await newRestaurant.save();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with reference to restaurant
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "restaurant",
      restaurant: savedRestaurant._id
    });
    
    // Save user
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );
    
    // Return success with token and restaurant ID
    res.status(201).json({
      message: "Restaurant registered successfully",
      token,
      restaurantId: savedRestaurant._id
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ message: "Error adding restaurant", error: error.message });
  }
});

// Restaurant Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).populate("restaurant");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );
    
    // Return success with token and restaurant ID
    res.status(200).json({
      message: "Login successful",
      token,
      restaurantId: user.restaurant._id
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
});

// Get All Restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error: error.message });
  }
});

// Get Restaurant by ID
router.get("/:id", async (req, res) => {
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

// Update Restaurant (protected route)
router.put("/:id", uploadMiddleware, async (req, res) => {
  try {
    const { name, address, cuisine, contact } = req.body;
    
    // Handle the image file if provided
    const updateData = { name, address, cuisine, contact };
    
    if (req.files && req.files["image"]) {
      updateData.image = `/uploads/${req.files["image"][0].filename}`;
    }
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant", error: error.message });
  }
});

module.exports = router;