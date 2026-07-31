const { body, param, query } = require("express-validator");

const {
    usernameRules,
    emailRules,
    passwordRules,
    mongoIdRules
} = require("./common.validator");

// @youssef: Customer Validators

const validateUpdateProfile = [

    usernameRules()
        .optional()
        .trim()
        .toLowerCase()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters.")
        .matches(/^[a-z0-9_]+$/)
        .withMessage(
            "Username can contain only lowercase letters, numbers and underscores."
        ),

    body("firstName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("First name cannot be empty.")
        .isLength({ max: 50 })
        .withMessage("First name cannot exceed 50 characters."),

    emailRules()
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Last name cannot be empty.")
        .isLength({ max: 50 })
        .withMessage("Last name cannot exceed 50 characters."),

    body("email")
        .optional()
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("phone")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Phone number cannot exceed 20 characters.")
];

const validateChangePassword = [

    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required."),

    passwordRules("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/)
    .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
    ),

];

const validateAddAddress = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Recipient name is required.")
        .isLength({ max: 100 })
        .withMessage("Recipient name cannot exceed 100 characters."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .isLength({ max: 20 })
        .withMessage("Phone number cannot exceed 20 characters."),

    body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required.")
        .isLength({ max: 100 })
        .withMessage("Country cannot exceed 100 characters."),

    body("governorate")
        .trim()
        .notEmpty()
        .withMessage("Governorate is required.")
        .isLength({ max: 100 })
        .withMessage("Governorate cannot exceed 100 characters."),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required.")
        .isLength({ max: 100 })
        .withMessage("City cannot exceed 100 characters."),

    body("street")
        .trim()
        .notEmpty()
        .withMessage("Street is required.")
        .isLength({ max: 200 })
        .withMessage("Street cannot exceed 200 characters."),

    body("building")
        .trim()
        .notEmpty()
        .withMessage("Building is required.")
        .isLength({ max: 50 })
        .withMessage("Building cannot exceed 50 characters."),

    body("apartment")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Apartment cannot exceed 50 characters."),

    body("postalCode")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Postal code cannot exceed 20 characters."),

    body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean.")

];

const validateUpdateAddress = [

    mongoIdRules("addressId")
        .isMongoId()
        .withMessage("Invalid address ID."),

    body("fullName")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Recipient name cannot exceed 100 characters."),

    body("phone")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Phone number cannot exceed 20 characters."),

    body("country")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Country cannot exceed 100 characters."),

    body("governorate")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Governorate cannot exceed 100 characters."),

    body("city")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("City cannot exceed 100 characters."),

    body("street")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Street cannot exceed 200 characters."),

    body("building")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Building cannot exceed 50 characters."),

    body("apartment")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Apartment cannot exceed 50 characters."),

    body("postalCode")
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Postal code cannot exceed 20 characters."),

    body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean.")

];

const validateDeleteAddress = [

    mongoIdRules("addressId")
        .isMongoId()
        .withMessage("Invalid address ID.")

];

// @youssef: Admin Validators
const validateGetAllUsers = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")

];

const validateGetUserById = [

    param("userId")
        .isMongoId()
        .withMessage("Invalid user ID.")

];

const validateUpdateUserStatus = [

    param("userId")
        .isMongoId()
        .withMessage("Invalid user ID."),

    body("isActive")
        .isBoolean()
        .withMessage("isActive must be a boolean.")

];

const validateDeleteUser = [

    param("userId")
        .isMongoId()
        .withMessage("Invalid user ID.")

];

module.exports = {
    validateUpdateProfile,
    validateChangePassword,
    validateAddAddress,
    validateUpdateAddress,
    validateDeleteAddress,
    validateGetAllUsers,
    validateGetUserById,
    validateUpdateUserStatus,
    validateDeleteUser
};