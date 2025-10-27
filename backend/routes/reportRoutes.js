const express = require("express");
const { protect } = require("../middlewares/authMiddlewares.js");
const { adminOnly } = require("../middlewares/authMiddlewares.js"); // assuming you have an adminOnly middleware
const { exportTasksReport, exportUsersReport } = require("../controllers/reportControllers.js");

const router = express.Router();

// Export all tasks as Excel/PDF
router.get("/export/tasks", protect, adminOnly, exportTasksReport);

// Export user-task report
router.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = router;
