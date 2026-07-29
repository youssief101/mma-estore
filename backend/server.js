require("dotenv").config();

const express = require("express");
const cors = require("cors"); // *
const helmet = require("helmet"); // *
const morgan = require("morgan"); // *




const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const categoryRoutes = require("./src/routes/category.routes");
const departmentRoutes = require("./src/routes/department.routes");
const brandRoutes = require("./src/routes/brand.routes");
const fighterRoutes = require("./src/routes/fighter.routes");
const eventRoutes = require("./src/routes/event.routes");
const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.routes");

const app = express();

connectDB();

app.use(cors()); // allowing angular to communicate with express
app.use(helmet()); // adds security headers automatically
app.use(morgan("dev")); // logs every request
app.use(express.json()); // parse incoming json request bodies
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/fighters", fighterRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);


app.get("/", (req, res)=> {
    res.json({
        success: true,
        message: "Welcome to mma e-store API"
    });
});

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});

// testing
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
