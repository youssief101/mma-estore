const express = require("express");

const {
    register,
    login,
    socialLogin,
    getCurrentUser,
    forgotPassword,
    resetPassword
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

// Social Login
router.post(
    "/social-login",
    socialLogin
);

// Current User
router.get(
    "/me",
    authenticate,
    getCurrentUser
);

// Forgot Password
router.post(
    "/forgot-password",
    forgotPassword
);

// Reset Password
router.post(
    "/reset-password",
    resetPassword
);

module.exports = router;