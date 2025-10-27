const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
} = require("../controllers/taskControllers.js"); // Import task controller functions
const { protect, adminOnly } = require("../middlewares/authMiddlewares.js"); // Import authentication middleware

const router = express.Router(); // Initialize Express Router

// Task Management Routes
router.get("/tasks/dashboard-data", protect, getDashboardData); // Route to get dashboard data (protected)
router.get("/tasks/user-dashboard-data", protect, getUserDashboardData); // Route to get user-specific dashboard data (protected)
router.get("/tasks", protect, getTasks); // Route to get all tasks (Admin: all, User: assigned tasks), protected
router.get("/tasks/:id", protect, getTaskById); // Route to get a single task by ID, protected
router.post("/tasks", protect, adminOnly, createTask); // Route to create a new task (Admin only), protected
router.put("/tasks/:id", protect, updateTask); // Route to update task details, protected
router.delete("/tasks/:id", protect, adminOnly, deleteTask); // Route to delete a task (Admin only), protected
router.put("/tasks/:id/status", protect, updateTaskStatus); // Route to update task status, protected
router.put("/tasks/:id/todo", protect, updateTaskChecklist); // Route to update task checklist, protected

module.exports = router; // Export the router for use in server.js
