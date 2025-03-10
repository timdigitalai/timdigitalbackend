const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Authenticate user middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1].trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

// Check if user is admin middleware
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error checking admin privileges.' 
    });
  }
};

console.log("Auth Middleware Loaded");
console.log("Auth Middleware Exported: ", { authenticate, isAdmin });

module.exports = { authenticate, isAdmin };
