const { body } = require("express-validator");

const { mongoIdRules } = require("./common.validator");

// Public Validators

const validateGetCategoryById = [

    mongoIdRules("categoryId")

];

// Admin Validators

const validateCreateCategory = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("image")
        .trim()
        .notEmpty()
        .withMessage("Image is required.")
        .isURL()
        .withMessage("Image must be a valid URL.")

];

const validateUpdateCategory = [

    mongoIdRules("categoryId"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category name cannot be empty.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters."),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty.")
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("image")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Image cannot be empty.")
        .isURL()
        .withMessage("Image must be a valid URL."),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean.")

];

const validateDeleteCategory = [

    mongoIdRules("categoryId")

];

module.exports = {
    validateGetCategoryById,
    validateCreateCategory,
    validateUpdateCategory,
    validateDeleteCategory
};