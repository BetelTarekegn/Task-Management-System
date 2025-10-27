const User = require("../models/User"); // Assuming User model is needed for populating assignedTo
const excelJS = require("exceljs");
const Task = require("../models/Task"); // Assuming Task model is imported for querying tasks

// @desc    Export all tasks as an Excel file
// @route   GET /api/reports/export/tasks
// @access  Private (Admin)
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email"); // Populate assignedTo with user's name and email

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach((task) => {
            // Assuming 'assignedTo' can be an array of users for a single task
            const assignedTo = task.assignedTo.map((user) => user.name).join(", ");

            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? task.dueDate.toLocaleDateString() : '', // Format date for readability
                assignedTo: assignedTo,
            });
        });

        // Set HTTP headers for file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );

        // Write the workbook to the response stream
        return workbook.xlsx.write(res).then(() => { res.end(); });


    } catch (error) {
        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select('name email _id').lean();
        const userTasks = await Task.find().populate('assignedTo', 'name email _id');

        const userTaskMap = {}; // Object to store user task summaries

        // Initialize user entries in userTaskMap
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email_id, // Assuming 'email_id' or 'email' field in User model
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        // Aggregate task data for each user
        userTasks.forEach((task) => {
            if (task.assignedTo) { // Check if the task is assigned to anyone
                task.assignedTo.forEach((assignedUser) => { // Iterate if assignedTo is an array of users
                    if (userTaskMap[assignedUser._id]) { // Ensure the user exists in our map
                        userTaskMap[assignedUser._id].taskCount += 1; // Increment total task count

                        // Increment count based on task status
                        if (task.status === "Pending") {
                            userTaskMap[assignedUser._id].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[assignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users Report");

        // Define the columns for the Excel worksheet, matching the report structure
        worksheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        // Add rows to the worksheet using data from the userTaskMap
        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });
        // Set response headers to prompt a file download in the browser
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="users_report.xlsx"'
        );

        // Write the Excel workbook to the response stream
        return workbook.xlsx.write(res).then(() => {
            res.end(); // End the response after sending the file
        });
    } catch (error) {

        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport,
};
