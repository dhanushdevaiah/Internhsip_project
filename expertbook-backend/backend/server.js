const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const dotenv   = require("dotenv");
const http     = require("http");
const helmet   = require("helmet");
const morgan   = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

// ─────────────────────────────────────────────
// LOAD ENV VARIABLES (.env file)
// ─────────────────────────────────────────────
dotenv.config();

// Guard: crash early if MONGO_URI is missing
if (!process.env.MONGO_URI) {
  console.error("❌  MONGO_URI is not defined in your .env file");
  process.exit(1);
}

const app    = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────
// SOCKET.IO  (single instance, shared via app.set)
// ─────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.set("io", io); // accessible in any controller via req.app.get("io")

// ─────────────────────────────────────────────
// SECURITY MIDDLEWARE
// ─────────────────────────────────────────────
app.use(helmet());        // 14 secure HTTP headers in one line
app.use(morgan("dev"));   // HTTP request logger

// Rate limiter – 100 requests / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// CORS – only allow the React frontend
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10kb" })); // Limit body size

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
const expertRoutes  = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.get("/", (req, res) =>
  res.json({ message: "ExpertBook API is running 🚀", status: "ok" })
);

app.use("/api/experts",  expertRoutes);
app.use("/api/bookings", bookingRoutes);

// 404 – catch undefined routes
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER (must be last middleware)
// ─────────────────────────────────────────────
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// ─────────────────────────────────────────────
// SOCKET.IO EVENTS
// ─────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("join_booking", (bookingId) => {
    socket.join(bookingId);
    console.log(`   ↳ Joined room: ${bookingId}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─────────────────────────────────────────────
// MONGODB ATLAS CONNECTION → then START SERVER
// ─────────────────────────────────────────────
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
  socketTimeoutMS: 45000,
};

mongoose
  .connect(process.env.MONGO_URI, MONGO_OPTIONS)
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`   CORS origin : ${process.env.CLIENT_URL || "http://localhost:3000"}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection failed:");
    console.error("   ", err.message);
    console.error("\n👉 Check your MONGO_URI in the .env file");
    console.error("👉 Make sure your IP is whitelisted in Atlas Network Access");
    process.exit(1); // non-zero exit signals failure to PM2/Docker
  });

// Graceful shutdown on Ctrl+C
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\n🛑 MongoDB connection closed. Server shutting down.");
  process.exit(0);
});
