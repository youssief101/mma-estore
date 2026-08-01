const { body, param, query } = require("express-validator");

const validateGetAllBrands = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")

];

// @youssef: Public Validators

const validateGetBrandById = [

    param("brandId")
        .isMongoId()
        .withMessage("Invalid brand ID.")

];

// @youssef: Admin Validators

const validateCreateBrand = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Brand name is required.")
        .isLength({ max: 100 })
        .withMessage("Brand name cannot exceed 100 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("logo")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Logo cannot be empty."),

    body("website")
        .optional()
        .trim()
        .isURL({
            protocols: ["http", "https"],
            require_protocol: true
        })
        .withMessage(
            "Website must be a valid URL starting with http:// or https://."
        )

];

const validateUpdateBrand = [

    param("brandId")
        .isMongoId()
        .withMessage("Invalid brand ID."),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Brand name cannot be empty.")
        .isLength({ max: 100 })
        .withMessage("Brand name cannot exceed 100 characters."),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty.")
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("logo")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Logo cannot be empty."),

    body("website")
        .optional()
        .trim()
        .custom((value) => {
            if (value === "") return true;

            return /^https?:\/\//i.test(value);
        })
        .withMessage(
            "Website must start with http:// or https://."
        ),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean.")

];

const validateDeleteBrand = [

    param("brandId")
        .isMongoId()
        .withMessage("Invalid brand ID.")

];

module.exports = {
    validateGetAllBrands,
    validateGetBrandById,
    validateCreateBrand,
    validateUpdateBrand,
    validateDeleteBrand
};