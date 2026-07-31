const { body, param, query } = require("express-validator");

const usernameRules = (field = "username") =>
    body(field)
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters.")
        .matches(/^[a-z0-9_]+$/)
        .withMessage(
            "Username can contain only lowercase letters, numbers and underscores."
        );

const emailRules = (field = "email") =>
    body(field)
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.");

const passwordRules = (field = "password") =>
    body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required.`)
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be between 8 and 50 characters.")
        .matches(/[A-Z]/)
        .withMessage(
            "Password must contain at least one uppercase letter."
        )
        .matches(/[a-z]/)
        .withMessage(
            "Password must contain at least one lowercase letter."
        )
        .matches(/[0-9]/)
        .withMessage(
            "Password must contain at least one number."
        )
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage(
            "Password must contain at least one special character."
        );

const mongoIdRules = (field) =>
    param(field)
        .isMongoId()
        .withMessage(`Invalid ${field}.`);

module.exports = {
    usernameRules,
    emailRules,
    passwordRules,
    mongoIdRules
};