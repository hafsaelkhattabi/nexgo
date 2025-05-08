const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Helper function for role checking
const requireCustomerRole = (req, res, next) => {
    if (req.user?.role !== 'customer') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied - customers only' 
      });
    }
    next();
  };
  
  // @route   POST api/customer/login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Find user with password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'No account found with this email'
        });
      }
  
      // 2. Check if user is a customer
      if (user.role !== 'customer') {
        return res.status(403).json({
          success: false,
          message: 'This email is not registered as a customer'
        });
      }
  
      // 3. Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect password'
        });
      }
  
      // 4. Create token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '7d' }
      );
  
      // 5. Get or create customer profile
      let customer = await Customer.findOne({ userId: user._id });
      if (!customer) {
        customer = await Customer.create({
          userId: user._id,
          name: user.name,
          email: user.email
        });
      }
  
      // 6. Successful response
      res.json({
        success: true,
        token,
        userId: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        profile: customer
      });
  
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  });
  
  // @route   GET api/customer/profile
  router.get('/profile', auth, requireCustomerRole, async (req, res) => {
    try {
      const customer = await Customer.findOne({ userId: req.user.id });
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer profile not found'
        });
      }
      
      res.json({
        success: true,
        profile: customer
      });
    } catch (err) {
      console.error('Profile error:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
  
  // @route   PUT api/customer/profile
  router.put('/profile', [
    auth,
    requireCustomerRole,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
  
    const { name, email, phone, preferences } = req.body;
  
    try {
      let customer = await Customer.findOne({ userId: req.user.id });
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer profile not found'
        });
      }
  
      // Update customer
      customer.name = name;
      customer.email = email;
      if (phone) customer.phone = phone;
      if (preferences) customer.preferences = preferences;
  
      // Update user
      const user = await User.findById(req.user.id);
      user.name = name;
      user.email = email;
  
      await user.save();
      await customer.save();
  
      res.json({
        success: true,
        profile: customer
      });
    } catch (err) {
      console.error('Update profile error:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });

// @route   PUT api/customer/profile
router.put('/profile', [
  auth,
  requireCustomerRole,
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, preferences } = req.body;

  try {
    let customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    // Update customer
    customer.name = name;
    customer.email = email;
    if (phone) customer.phone = phone;
    if (preferences) customer.preferences = { ...customer.preferences, ...preferences };

    // Update user
    const user = await User.findById(req.user.id);
    user.name = name;
    user.email = email;

    await user.save();
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/customer/address
router.post('/address', [
  auth,
  requireCustomerRole,
  check('street', 'Street is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('postalCode', 'Postal code is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, street, city, state, postalCode, country, isDefault } = req.body;

  try {
    let customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    const newAddress = {
      title: title || 'Home',
      street,
      city,
      state,
      postalCode,
      country: country || 'US',
      isDefault: isDefault || false
    };

    if (newAddress.isDefault) {
      customer.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    customer.addresses.push(newAddress);
    await customer.save();
    res.json(customer.addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/customer/address/:id
router.delete('/address/:id', auth, requireCustomerRole, async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    const addressIndex = customer.addresses.findIndex(
      addr => addr._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    customer.addresses.splice(addressIndex, 1);
    await customer.save();
    res.json(customer.addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/customer/favorites/:restaurantId
router.post('/favorites/:restaurantId', auth, requireCustomerRole, async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    const restaurantId = req.params.restaurantId;
    if (customer.favorites.includes(restaurantId)) {
      return res.status(400).json({ message: 'Restaurant already in favorites' });
    }

    customer.favorites.push(restaurantId);
    await customer.save();
    res.json(customer.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/customer/favorites/:restaurantId
router.delete('/favorites/:restaurantId', auth, requireCustomerRole, async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    const restaurantId = req.params.restaurantId;
    customer.favorites = customer.favorites.filter(
      id => id.toString() !== restaurantId
    );

    await customer.save();
    res.json(customer.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;