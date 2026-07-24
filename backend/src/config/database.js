const mongoose = require("mongoose");
const connectDB = async()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch(error) {
        console.error("MongoDB connection failed");
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;

// Advantages of isolating database.js:

// Single responsibility
// Easier maintenance
// Cleaner startup logic
// Easy to reuse in testing