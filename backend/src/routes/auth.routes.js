const express = require("express");

const {
    register,
    login,
    getCurrentUser
} = require("../controllers/auth.controller");

const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Get current authenticated user
router.get("/me", authenticate, getCurrentUser);

module.exports = router;