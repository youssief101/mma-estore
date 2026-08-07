const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env"), override: true });
require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");

const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const categoryRoutes = require("./src/routes/category.routes");
const departmentRoutes = require("./src/routes/department.routes");
const brandRoutes = require("./src/routes/brand.routes");
const fighterRoutes = require("./src/routes/fighter.routes");
const eventRoutes = require("./src/routes/event.routes");
const productRoutes = require("./src/routes/product.routes");
const orderRoutes = require("./src/routes/order.routes");
const cartRoutes = require("./src/routes/cart.routes");
const giftCardRoutes = require("./src/routes/giftCard.routes");
const homeRoutes = require("./src/routes/home.routes");

const app = express();

connectDB();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/fighters", fighterRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/gift-cards", giftCardRoutes);
app.use("/api/home", homeRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Database Error Handling Middleware
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongoServerSelectionError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn("[AI Studio] Database offline — returning fallback response");
    if (req.method === "GET") {
      return res.json(req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {});
    }
    return res.status(503).json({ error: "Service temporarily unavailable (database offline)" });
  }
  next(err);
});

// Serve Angular Static Files and Public Image Assets
const publicAssetsPath = path.join(__dirname, "../mma-estore-frontend/public");
if (fs.existsSync(publicAssetsPath)) {
  app.use(express.static(publicAssetsPath));
}

const possibleDistPaths = [
  path.join(__dirname, "../mma-estore-frontend/dist/mma-estore-frontend/browser"),
  path.join(__dirname, "../mma-estore-frontend/dist/mma-estore-frontend"),
  path.join(__dirname, "public"),
];

const distPath = possibleDistPaths.find((p) => fs.existsSync(p)) || possibleDistPaths[0];

app.use(express.static(distPath));

app.use((req, res) => {
  const indexHtml = path.join(distPath, "index.html");
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.json({
      success: true,
      message: "Welcome to mma e-store API",
    });
  }
});

// Load Mongoose Models
require("./src/models/Category");
require("./src/models/Department");
require("./src/models/Brand");
require("./src/models/Event");
require("./src/models/Fighter");
require("./src/models/Product");
require("./src/models/Address");
require("./src/models/User");
require("./src/models/GiftCard");
require("./src/models/Cart");
require("./src/models/Order");

console.log("All models loaded successfully.");

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
