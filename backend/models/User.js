
// middleware/auth.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // JWT secret from environment variables
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// // Middleware to protect routes - verifies JWT token
// exports.protect = async (req, res, next) => {
//   try {
//     let token;
    
//     // Check if token exists in Authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }
    
//     // If no token found
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized to access this route'
//       });
//     }
    
//     try {
//       // Verify token
//       const decoded = jwt.verify(token, JWT_SECRET);
      
//       // Get user from database
//       const user = await User.findById(decoded.id);
      
//       // Check if user exists
//       if (!user) {
//         return res.status(401).json({
//           success: false,
//           message: 'User not found'
//         });
//       }
      
//       // Check if user is active
//       if (!user.isActive) {
//         return res.status(401).json({
//           success: false,
//           message: 'User account is deactivated'
//         });
//       }
      
//       // Set user in request
//       req.user = {
//         id: user._id,
//         role: user.role
//       };
      
//       next();
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token'
//       });
//     }
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

// // Middleware to restrict access based on role
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Role [${req.user?.role}] is not authorized to access this route`
//       });
//     }
//     next();
//   };
// };