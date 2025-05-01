// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const router = express.Router();

// // In-memory user storage (replace with database in production)
// const users = [
//   // Predefined admin user
//   {
//     id: 1,
//     username: "admin",
//     email: "admin@fooddelivery.com",
//     password: "$2a$10$XQnzUCHAzAVK/gi2WGWReeYOsBnd4U29.JRTJejEpQX6/Mbgck8rW", // hashed "admin123"
//     name: "Admin User",
//     role: "admin"
//   }
// ];

// // Register endpoint
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password, role, name } = req.body;
    
//     // Check if user exists
//     if (users.find(u => u.email === email)) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     if (users.find(u => u.username === username)) {
//       return res.status(400).json({ message: 'Username already taken' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Create new user
//     const user = {
//       id: users.length + 1,
//       username,
//       email,
//       password: hashedPassword,
//       name: name || '',
//       role: role || 'customer'
//     };
    
//     users.push(user);
    
//     // Create token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       'your-secret-key',
//       { expiresIn: '24h' }
//     );
    
//     res.status(201).json({ 
//       token, 
//       user: { 
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         name: user.name 
//       } 
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating user' });
//   }
// });

// // Login endpoint
// router.post('/login', async (req, res) => {
//   try {
//     const { login, password } = req.body;
    
//     // Find user by email or username
//     const user = users.find(u => u.email === login || u.username === login);
//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }
    
//     // Check password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: 'Invalid password' });
//     }
    
//     // Create token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       'your-secret-key',
//       { expiresIn: '24h' }
//     );
    
//     res.json({ 
//       token, 
//       user: { 
//         id: user.id, 
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         name: user.name 
//       } 
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in' });
//   }
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, name, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, name, role });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "your_secret", { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
