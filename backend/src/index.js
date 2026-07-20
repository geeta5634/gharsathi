const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const paymentRoutes = require("./routes/payments");
const serviceRoutes = require("./routes/services");

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.prisma = prisma;

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("Database connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`GharSathi server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
