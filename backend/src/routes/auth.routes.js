const express = require("express");

const {
    register,
    login,
    getCurrentUser
} = require("../controllers/auth.controller");

const authenticate = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validation.middleware");

const {
    registerValidator,
    loginValidator
} = require("../validators/auth.validator");

const router = express.Router();

// Register
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

// Login
router.post(
    "/login",
    loginValidator,
    validate,
    login
);

// Current User
router.get(
    "/me",
    authenticate,
    getCurrentUser
);

module.exports = router;