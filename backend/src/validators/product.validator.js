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
        .isInt({ min: 1 })
        .withMessage("Product code must be a positive integer."),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ max: 200 })
        .withMessage("Product name cannot exceed 200 characters."),

    body("brandID")
        .isMongoId()
        .withMessage("Invalid brand ID."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ max: 5000 })
        .withMessage("Description cannot exceed 5000 characters."),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to 0."),

    body("oldPrice")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Old price must be greater than or equal to 0."),

    body("discountPercentage")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100."),

    body("onSale")
        .optional()
        .isBoolean()
        .withMessage("onSale must be boolean."),

    body("categoryID")
        .isMongoId()
        .withMessage("Invalid category ID."),

    body("departmentID")
        .isMongoId()
        .withMessage("Invalid department ID."),

    body("fighterID")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Invalid fighter ID."),

    body("eventID")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Invalid event ID."),

    body("audience")
        .isIn(Audiences)
        .withMessage("Invalid audience."),

    body("images")
        .isArray({ min: 1 })
        .withMessage("At least one image is required."),

    body("images.*.url")
        .notEmpty()
        .withMessage("Image URL is required."),

    body("images.*.isPrimary")
        .optional()
        .isBoolean()
        .withMessage("isPrimary must be boolean."),

    body("inventory.totalStock")
        .isInt({ min: 0 })
        .withMessage("Total stock cannot be negative."),

    body("inventory.variants")
        .optional()
        .isArray()
        .withMessage("Variants must be an array."),

    body("inventory.variants.*.size")
        .optional()
        .isIn(Sizes)
        .withMessage("Invalid size."),

    body("inventory.variants.*.stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock cannot be negative."),

    body("specifications")
        .optional()
        .isArray(),

    body("display")
        .optional()
        .isObject()

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