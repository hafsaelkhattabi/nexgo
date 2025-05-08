const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/customer');
const {auth} = require('../middleware/auth');
const { check, validationResult } = require('express-validator');


module.exports = function(role) {
    return function(req, res, next) {
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied: role mismatch' });
      }
      next();
    };
  };

// @route   POST api/auth/register
// @desc    Register a user and create customer profile
// @access  Public
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, name } = req.body;

  try {
    // Check if user already exists
    let userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? 'Email already in use' : 'Username already taken' 
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      name,
      role: 'customer'
    });

    await user.save();

    // Create customer profile
    const customer = new Customer({
      userId: user._id,
      name: name,
      email: email
    });

    await customer.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('username', 'Username is required').exists(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'jwtSecret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile;
    if (user.role === 'customer') {
      profile = await Customer.findOne({ userId: user._id });
    }
    // Add conditions for restaurant and delivery profiles if needed

    res.json({
      user,
      profile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;