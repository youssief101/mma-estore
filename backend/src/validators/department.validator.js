const { body, param } = require("express-validator");

// @youssef: Public Validators

const validateGetDepartmentById = [

    param("departmentId")
        .isMongoId()
        .withMessage("Invalid department ID.")

];

// @youssef: Admin Validators

const validateCreateDepartment = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Department name must be between 2 and 100 characters."
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ max: 500 })
        .withMessage(
            "Description cannot exceed 500 characters."
        ),

    body("image")
        .trim()
        .notEmpty()
        .withMessage("Image is required.")
        .isURL()
        .withMessage("Image must be a valid URL.")

];

const validateUpdateDepartment = [

    param("departmentId")
        .isMongoId()
        .withMessage("Invalid department ID."),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Department name cannot be empty.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Department name must be between 2 and 100 characters."
        ),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty.")
        .isLength({ max: 500 })
        .withMessage(
            "Description cannot exceed 500 characters."
        ),

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

const validateDeleteDepartment = [

    param("departmentId")
        .isMongoId()
        .withMessage("Invalid department ID.")

];

module.exports = {
    validateGetDepartmentById,
    validateCreateDepartment,
    validateUpdateDepartment,
    validateDeleteDepartment
};