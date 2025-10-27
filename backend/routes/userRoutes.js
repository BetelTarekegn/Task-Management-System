const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddlewares.js");
const { getUsers, getUserById } = require("../controllers/userControllers.js");
const router = express.Router();

// User Management Routes
router.get("/users", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/users/:id", protect, getUserById); // Get a spacfice User


module.exports = router;
