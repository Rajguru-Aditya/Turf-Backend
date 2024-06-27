const express = require("express");
const dotenv = require("dotenv").config();
const { dbConnection } = require("./config/dbConnection");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4444;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://turf-booking-website-client.vercel.app",
  ],
  methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  allowedHeaders: [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/turfs", require("./routes/turfRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/turfOwner", require("./routes/turfOwnerRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("Server Running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}. All Set`);
});
