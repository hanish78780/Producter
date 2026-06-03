const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// Serve static client files in production
const clientBuildPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server Running (Client build not found)");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});