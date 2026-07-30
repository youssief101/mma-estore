const mongoose = require("mongoose");

const connectDB = async () => {

    console.log(process.env.MONGODB_URI);

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully");

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

};

module.exports = connectDB;