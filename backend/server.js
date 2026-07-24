require("dotenv").config();

const express = require("express");
const cors = require("cors"); // *
const helmet = require("helmet"); // *
const morgan = require("morgan"); // *

const connectDB = require("./src/config/database");
const app = express();

connectDB();

app.use(cors()); // allowing angular to communicate with express
app.use(helmet()); // adds security headers automatically
app.use(morgan("dev")); // logs every request
app.use(express.json()); // parse incoming json request bodies

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