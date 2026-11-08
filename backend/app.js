const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Stripe, Cloudinary, and external font scripts
    crossOriginEmbedderPolicy: false,
  })
);

// General API Rate Limiting: 300 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1", generalLimiter);

// Strict Rate Limiting for Auth Endpoints to Prevent Brute-Force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/login", authLimiter);
app.use("/api/v1/register", authLimiter);
app.use("/api/v1/password/forgot", authLimiter);

// Stripe Webhook MUST be mounted before standard express.json to preserve raw Buffer
const webhook = require("./routes/webhookRoute");
app.use("/api/v1", webhook);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());

// Gzip Compression for Performance
app.use(compression());

// Interactive Swagger / OpenAPI Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const coupon = require("./routes/couponRoute");
const wishlist = require("./routes/wishlistRoute");

// Healthcheck Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", coupon);
app.use("/api/v1", wishlist);

app.use(
  express.static(path.join(__dirname, "../frontend/build"), {
    maxAge: "1d",
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
