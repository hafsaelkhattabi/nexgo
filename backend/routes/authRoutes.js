const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const Restaurant = require("../models/restaurantauth"); 
// const Delivery = require("../models/deliveryauth"); 
// const Customer = require("../models/customerauth"); 
const User = require("../models/User")
const router = express.Router();


// Register Route (for Restaurant, Delivery, Customer)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if role is valid
    if (!["restaurant", "delivery", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user already exists in the specified collection
    let existingUser;
    if (role === "restaurant") {
      existingUser = await Restaurant.findOne({ username });
    } else if (role === "delivery") {
      existingUser = await Delivery.findOne({ username });
    } else if (role === "customer") {
      existingUser = await Customer.findOne({ username });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user based on the role
    let newUser;
    if (role === "restaurant") {
      newUser = new Restaurant({
        username,
        password: hashedPassword,
      });
    } else if (role === "delivery") {
      newUser = new Delivery({
        username,
        password: hashedPassword,
      });
    } else if (role === "customer") {
      newUser = new Customer({
        username,
        password: hashedPassword,
      });
    }

    // Save the new user to the corresponding collection
    await newUser.save();

    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check in all collections (restaurant, delivery, customer)
    let user = await Restaurant.findOne({ username });
    let role = "restaurant";

    if (!user) {    
      user = await Delivery.findOne({ username });
      role = "delivery";
    }

    if (!user) {
      user = await Customer.findOne({ username });
      role = "customer";
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Include role in the JWT token
    const token = jwt.sign({ id: user._id, role }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(200).json({ token, role });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
