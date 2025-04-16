const express = require("express");
const Delivery = require("../models/DeliveryForm");

const router = express.Router();

// Create a new delivery
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, vehicleType } = req.body;
    
    if (!name || !email || !phone || !address || !vehicleType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const newDelivery = new Delivery({ 
      name, 
      email, 
      phone, 
      address, 
      vehicleType 
    });
    await newDelivery.save();
    
    res.status(201).json({ message: "Delivery added successfully!" });
  } catch (error) {
    console.error("Error adding delivery:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get all deliveries
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
