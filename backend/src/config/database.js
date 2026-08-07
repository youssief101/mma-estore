const mongoose = require("mongoose");
const seedDatabase = require("../utils/seedDatabase");

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || !mongoUri.startsWith("mongodb")) {
      mongoUri = "mongodb://127.0.0.1:27017/mma-estore";
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log("MongoDB connected successfully");
    await seedDatabase();
  } catch (error) {
    console.warn("[AI Studio] MongoDB connection warning:", error.message);
  }
};

module.exports = connectDB;
