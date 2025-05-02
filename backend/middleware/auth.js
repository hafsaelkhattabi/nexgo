// const jwt = require("jsonwebtoken");

// const authMiddleware = (roles) => {
//   return (req, res, next) => {
//     const token = req.header("Authorization");
//     console.log("Token received:", token);
//     if (!token) {
//       return res.status(401).json({ message: "No token, authorization denied" });
//     }
//     try {
//       const decoded = jwt.verify(token, "your_jwt_secret");
//       console.log("Decoded token:", decoded); 
//       req.userId = decoded.id;
//       req.role = decoded.role;

//       if (!roles.includes(decoded.role)) {
//         return res.status(403).json({ message: "Access denied" });
//       }
//       next();
//     } catch (error) {
//       console.error("Token verification error:", error);
//       res.status(401).json({ message: "Token is not valid" });
//     }
//   };
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found, access denied" });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid, access denied" });
  }
};

// Middleware to check if user is a restaurant owner
const isRestaurantOwner = async (req, res, next) => {
  try {
    if (req.user.role !== "restaurant_owner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not a restaurant owner" });
    }
    next();
  } catch (error) {
    console.error("Restaurant owner check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if the user owns the restaurant they're trying to modify
const ownsRestaurant = async (req, res, next) => {
  try {
    // For routes with restaurantId as parameter
    const restaurantId = req.params.id;
    
    if (req.user.role === "admin") {
      // Admins can modify any restaurant
      return next();
    }
    
    if (req.user.restaurant.toString() !== restaurantId) {
      return res.status(403).json({ message: "Access denied, you don't own this restaurant" });
    }
    
    next();
  } catch (error) {
    console.error("Restaurant ownership check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { auth, isRestaurantOwner, ownsRestaurant };