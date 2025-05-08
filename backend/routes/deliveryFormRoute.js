const express = require("express");
const Delivery = require("../models/DeliveryForm");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Add this import for JWT
const {auth} = require("../middleware/auth"); // Optional: Import auth middleware

const router = express.Router();
const JWT_SECRET = "me";
// Create a new delivery driver (registration)
// Update this section in your deliveryFormRoute.js file

router.post("/register", async (req, res) => {
  console.log("📦 /delivery/register hit!");
  console.log("Request body:", req.body); // Log the request body
  
  let session;
  
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    
    const { name, email, phone, address, password, confirmPassword, dateOfBirth, vehicleType } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !address || !password || !dateOfBirth || !vehicleType) {
      console.log("Missing required fields:", { name, email, phone, address, password: !!password, dateOfBirth, vehicleType });
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists in User collection
    console.log("Checking if email exists:", email);
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      console.log("Email already exists");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new delivery driver record
    console.log("Creating new delivery driver record");
    const newDelivery = new Delivery({ 
      name, 
      email, 
      phone, 
      address,
      password,
      dateOfBirth: new Date(dateOfBirth), 
      vehicleType 
    });
    
    console.log("Saving delivery record");
    await newDelivery.save({ session });
    
    // Create corresponding user account with 'delivery' role
    console.log("Creating user account");
    const newUser = new User({
      email,
      password, // Will be hashed by the User model pre-save hook
      role: "delivery",
      delivery: newDelivery._id
    });
    
    console.log("Saving user account");
    await newUser.save({ session });
    
    // Create JWT token
    console.log("Creating JWT token");
    const token = jwt.sign(
      { 
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET || "your_jwt_secret", // Fallback for missing env variable
      { expiresIn: '24h' }
    );
    
    // Commit the transaction
    console.log("Committing transaction");
    await session.commitTransaction();
    session.endSession();
    
    // Return success with token and user data (but don't include password)
    const responseData = {
      _id: newDelivery._id,
      name: newDelivery.name,
      email: newDelivery.email,
      phone: newDelivery.phone,
      address: newDelivery.address,
      dateOfBirth: newDelivery.dateOfBirth,
      vehicleType: newDelivery.vehicleType,
      role: newUser.role
    };
    
    console.log("Registration successful!");
    res.status(201).json({ 
      message: "Registration successful!",
      token,
      driver: responseData
    });
  } catch (error) {
    // Abort transaction on error
    console.error("Error registering delivery driver:", error.message);
    console.error("Full error:", error);
    
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (sessionError) {
        console.error("Error aborting transaction:", sessionError);
      }
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    // Check for specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // Check for JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({ message: "JWT token creation failed. Check your JWT_SECRET." });
    }
    
    res.status(500).json({ 
      message: "Server error. Please try again later.",
      error: error.message // Only in development - remove in production
    });
  }
});

// Login route for delivery drivers
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const deliveryUser = await Delivery.findOne({ email });
    if (!deliveryUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await deliveryUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: deliveryUser._id, role: "delivery" },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      token,
      userId: deliveryUser._id,
      role: "delivery"
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// The following routes should be protected with auth middleware
// Get all delivery drivers (admin route)
router.get("/", auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  
  try {
    // Get all drivers
    const drivers = await Delivery.find();
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching delivery drivers:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get a specific driver by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const driver = await Delivery.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Only allow admin or the driver themselves to access the data
    if (req.user.role !== 'admin' && req.user.delivery.toString() !== driver._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update driver information
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, phone, address, vehicleType, dateOfBirth } = req.body;
    
    // Check if driver exists
    const driver = await Delivery.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Only allow admin or the driver themselves to update the data
    if (req.user.role !== 'admin' && req.user.delivery.toString() !== driver._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Find and update the driver
    const updatedDriver = await Delivery.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        phone, 
        address, 
        vehicleType,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      message: "Driver information updated successfully",
      driver: updatedDriver
    });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Change password
router.patch("/:id/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    
    // Find the driver
    const driver = await Delivery.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Only allow admin or the driver themselves to change password
    if (req.user.role !== 'admin' && req.user.delivery.toString() !== driver._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Find the user account associated with this driver
    const user = await User.findOne({ email: driver.email });
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Delete a driver
router.delete("/:id", auth, async (req, res) => {
  // Only admin should be able to delete drivers
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the driver
    const driver = await Delivery.findById(req.params.id).session(session);
    if (!driver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Driver not found" });
    }
    
    // Find and delete the associated user account
    const user = await User.findOneAndDelete({ 
      email: driver.email,
      role: "delivery" 
    }).session(session);
    
    // Delete the driver record
    await Delivery.findByIdAndDelete(req.params.id).session(session);
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;