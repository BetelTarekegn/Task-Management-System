require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes.js")
const userRoute = require("./routes/userRoutes.js")
const taskRoute = require("./routes/taskRoutes.js")
const reportRoute = require("./routes/reportRoutes.js")

const app = express();

//Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//Connect To DataBase
connectDB();

//Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api", userRoute);
app.use("/api", taskRoute);
app.use("/api/reports", reportRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
