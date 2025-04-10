const jwt = require("jsonwebtoken");

const authMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Token received:", token);
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      console.log("Decoded token:", decoded); 
      req.userId = decoded.id;
      req.role = decoded.role;

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Token is not valid" });
    }
  };
};

module.exports = authMiddleware;