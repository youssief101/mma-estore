const { body } = require("express-validator");

const {
    usernameRules,
    emailRules,
    passwordRules
} = require("./common.validator");

const registerValidator = [

    usernameRules()
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters.")
        .matches(/^[a-z0-9_]+$/)
        .withMessage(
            "Username can contain only lowercase letters, numbers and underscores."
        ),

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "First name must be between 2 and 50 characters."
        ),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
            "Last name must be between 2 and 50 characters."
        ),

    emailRules()
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),

    body("phone")
        .optional()
        .trim()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage("Invalid phone number.")

];

const loginValidator = [

    emailRules()
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];

module.exports = {
    registerValidator,
    loginValidator
};