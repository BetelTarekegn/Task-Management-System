const mongoose = require("mongoose");

// Sub-schema for checklist items
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Task schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Task title
    description: { type: String }, // Optional description/details

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"], // Allowed values
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"], // Task workflow
      default: "Pending",
    },

    dueDate: { type: Date, required: true }, // Task deadline

    // Task can be assigned to multiple users
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // The user who created the task
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // File uploads or related attachments
    attachments: [{ type: String }],

    // Array of checklist items
    todoChecklist: [todoSchema],

    // % completion (useful for progress tracking in frontend)
    progress: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Task", taskSchema);
