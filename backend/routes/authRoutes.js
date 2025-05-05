// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// // const Restaurant = require("../models/restaurantauth"); 
// // const Delivery = require("../models/deliveryauth"); 
// // const Customer = require("../models/customerauth"); 
// const User = require("../models/User")
// const router = express.Router();


// // Register Route (for Restaurant, Delivery, Customer)
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     // Check if role is valid
//     if (!["restaurant", "delivery", "customer"].includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     // Check if user already exists in the specified collection
//     let existingUser;
//     if (role === "restaurant") {
//       existingUser = await Restaurant.findOne({ username });
//     } else if (role === "delivery") {
//       existingUser = await Delivery.findOne({ username });
//     } else if (role === "customer") {
//       existingUser = await Customer.findOne({ username });
//     }

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user based on the role
//     let newUser;
//     if (role === "restaurant") {
//       newUser = new Restaurant({
//         username,
//         password: hashedPassword,
//       });
//     } else if (role === "delivery") {
//       newUser = new Delivery({
//         username,
//         password: hashedPassword,
//       });
//     } else if (role === "customer") {
//       newUser = new Customer({
//         username,
//         password: hashedPassword,
//       });
//     }

//     // Save the new user to the corresponding collection
//     await newUser.save();

//     res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error registering user", error });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check in all collections (restaurant, delivery, customer)
//     let user = await Restaurant.findOne({ username });
//     let role = "restaurant";

//     if (!user) {    
//       user = await Delivery.findOne({ username });
//       role = "delivery";
//     }

//     if (!user) {
//       user = await Customer.findOne({ username });
//       role = "customer";
//     }

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Include role in the JWT token
//     const token = jwt.sign({ id: user._id, role }, "your_jwt_secret", { expiresIn: "1h" });
//     res.status(200).json({ token, role });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error });
//   }
// });

// module.exports = router;


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const router = express.Router();

// Restaurant Registration
router.post("/register", async (req, res) => {
  try {
    const { name, address, cuisine, contact, email, password } = req.body;
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Create new restaurant
    const newRestaurant = new Restaurant({
      name,
      address,
      cuisine,
      contact,
      image: "/placeholder.svg" // Default image, can be updated later
    });
    
    const savedRestaurant = await newRestaurant.save();
    
    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "restaurant",
      restaurant: savedRestaurant._id
    });
    
    await newUser.save();
    
    // Update restaurant with owner reference
    savedRestaurant.owner = newUser._id;
    await savedRestaurant.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, restaurantId: savedRestaurant._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );
    
    res.status(201).json({
      message: "Restaurant registered successfully",
      token,
      restaurantId: savedRestaurant._id
    });
  } catch (error) {
    res.status(500).json({ message: "Error in registration", error: error.message });
  }
});

// Restaurant Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).populate("restaurant");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Verify user is a restaurant owner
    if (user.role !== "restaurant" || !user.restaurant) {
      return res.status(403).json({ message: "Restaurant access required" });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, restaurantId: user.restaurant._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );
    
    res.json({
      token,
      restaurantId: user.restaurant._id,
      user: { email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

module.exports = router;