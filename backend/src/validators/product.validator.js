const { body, param, query } = require("express-validator");
const { Audiences, Sizes } = require("../constants/enums");

// @youssef: Public Validators

const validateGetAllProducts = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")

];

const validateSearchProducts = [

    query("q")
        .trim()
        .notEmpty()
        .withMessage("Search query is required.")

];

const validateFilterProducts = [

    query("categoryID")
        .optional()
        .isMongoId()
        .withMessage("Invalid category ID."),

    query("brandID")
        .optional()
        .isMongoId()
        .withMessage("Invalid brand ID."),

    query("departmentID")
        .optional()
        .isMongoId()
        .withMessage("Invalid department ID."),

    query("fighterID")
        .optional()
        .isMongoId()
        .withMessage("Invalid fighter ID."),

    query("eventID")
        .optional()
        .isMongoId()
        .withMessage("Invalid event ID."),

    query("audience")
        .optional()
        .isIn(Audiences)
        .withMessage("Invalid audience."),

    query("onSale")
        .optional()
        .isBoolean()
        .withMessage("onSale must be true or false."),

    query("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be positive."),

    query("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be positive.")

];

const validateProductId = [

    param("id")
        .isMongoId()
        .withMessage("Invalid product ID.")

];


// @youssef: Admin Validators


const validateCreateProduct = [

    body("productCode")
        .optional({ nullable: true }),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ max: 200 })
        .withMessage("Product name cannot exceed 200 characters."),

    body("brandID")
        .optional({ nullable: true }),

    body("description")
        .optional({ nullable: true })
        .trim(),

    body("price")
        .optional({ nullable: true }),

    body("oldPrice")
        .optional({ nullable: true }),

    body("discountPercentage")
        .optional({ nullable: true }),

    body("onSale")
        .optional({ nullable: true }),

    body("categoryID")
        .optional({ nullable: true }),

    body("departmentID")
        .optional({ nullable: true }),

    body("fighterID")
        .optional({ nullable: true }),

    body("eventID")
        .optional({ nullable: true }),

    body("audience")
        .optional({ nullable: true }),

    body("images")
        .optional({ nullable: true }),

    body("inventory")
        .optional({ nullable: true }),

    body("specifications")
        .optional({ nullable: true }),

    body("display")
        .optional({ nullable: true })

];

const validateUpdateProduct = [

    validateProductId,

    body("productCode")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Product code must be positive."),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty.")
        .isLength({ max: 200 })
        .withMessage("Product name cannot exceed 200 characters."),

    body("brandID")
        .optional()
        .isMongoId()
        .withMessage("Invalid brand ID."),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty."),

    body("price")
        .optional()
        .isFloat({ min: 0 }),

    body("oldPrice")
        .optional({ nullable: true })
        .isFloat({ min: 0 }),

    body("discountPercentage")
        .optional()
        .isFloat({ min: 0, max: 100 }),

    body("categoryID")
        .optional()
        .isMongoId(),

    body("departmentID")
        .optional()
        .isMongoId(),

    body("fighterID")
        .optional({ nullable: true })
        .isMongoId(),

    body("eventID")
        .optional({ nullable: true })
        .isMongoId(),

    body("audience")
        .optional()
        .isIn(Audiences)

];

module.exports = {
    validateGetAllProducts,
    validateSearchProducts,
    validateFilterProducts,
    validateProductId,
    validateCreateProduct,
    validateUpdateProduct
};