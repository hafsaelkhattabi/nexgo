const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const deliveryRoutes = require('./routes/DeliveryRoutes');
const restaurantRoutes = require("./routes/RestaurantRoutes");
const deliveryRoute = require("./routes/deliveryRoute");
const authRoutes = require("./routes/authRoutes");
const restaurantRoutesauth = require("./routes/restaurantRoutesauth");
const restauraantroutesdash = require("./routes/restaurantroutesdash");
const menu = require("./routes/menu");
const order = require("./routes/order");
const notificationRoutes = require("./routes/NotificationRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve static files

// MongoDB URI and Port
const uri = "mongodb+srv://hafsaelkhattabi:hafssa1213@cluster0.k7zrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
const PORT = 5000; 

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/restaurants", restaurantRoutes); // Restaurant routes
app.use("/image", uploadRoutes); // File upload routes
app.use("/apply", deliveryRoutes); // Delivery application routes
app.use("/deliveries", deliveryRoute); // Delivery form routes
app.use("/api/restaurant", restaurantRoutesauth);
app.use("/login", authRoutes);
app.use("/restaurants", restauraantroutesdash);
app.use("/deliveries", deliveryRoutes);
app.use("/menu", menu);
app.use("/orders", order);
app.use("/notification", notificationRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});