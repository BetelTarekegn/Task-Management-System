const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      console.log("AUTH HEADER:", req.headers.authorization); // debug log

      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        return res
          .status(401)
          .json({ message: "Authorization header must start with Bearer" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to req
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res
      .status(401)
      .json({ message: "Not authorized, token invalid" });
  }
};

// Middleware for Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protect, adminOnly };
