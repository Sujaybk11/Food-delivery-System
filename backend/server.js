import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

import adminRouter from "./routes/adminRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import couponRouter from "./routes/couponRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Security and performance middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5176',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5176',
  'https://food-delivery-system-0nyi.onrender.com',
  'https://food-delivery-frontend-s2l9.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle preflight requests
app.options('*', cors());

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// DB connection with retry logic
let dbConnected = false;
const initDB = async () => {
  try {
    await connectDB();
    dbConnected = true;
  } catch (error) {
    console.error('Initial DB connection failed, retrying in 5s...');
    setTimeout(initDB, 5000);
  }
};
initDB();

// Health check middleware
app.use((req, res, next) => {
  if (!dbConnected && req.path !== '/health') {
    return res.status(503).json({ success: false, message: 'Database not connected' });
  }
  next();
});

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads", { maxAge: '1d' }));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.use("/api/admin", adminRouter);
app.use("/api/review", reviewRouter);
app.use("/api/coupon", couponRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "API Working", 
    dbConnected,
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Food Delivery API v1.0" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`🚀 Server Started on port: ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
