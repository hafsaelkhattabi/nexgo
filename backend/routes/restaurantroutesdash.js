const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant', error: error.message });
  }
});

// Create a new restaurant
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(400).json({ message: 'Failed to create restaurant', error: error.message });
  }
});

// Update a restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(400).json({ message: 'Failed to update restaurant', error: error.message });
  }
});

// Delete a restaurant
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
  }
});

module.exports = router;
