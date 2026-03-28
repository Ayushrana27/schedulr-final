const cors = require("cors");

app.use(cors({
  origin: "*"
}));
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import Routes
const eventRoutes = require("./routes/eventRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});