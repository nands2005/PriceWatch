const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const amazonRoutes = require("./routes/amazonRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Start automatic price monitor
require("./jobs/priceMonitor");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "PriceWatch API is running",
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/amazon", amazonRoutes);

app.use(
    "/api/notifications",
    notificationRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});