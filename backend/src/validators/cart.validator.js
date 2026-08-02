const { body } = require("express-validator");
const { Sizes } = require("../constants/enums");

// @Ali: Add product to cart
const validateAddProductToCart = [

    body("productID")
        .notEmpty()
        .withMessage("Product ID is required.")
        .isMongoId()
        .withMessage("Invalid product ID."),

    body("size")
        .notEmpty()
        .withMessage("Size is required.")
        .isIn(Sizes)
        .withMessage("Invalid size."),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required.")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1.")

];

// @Ali: Update cart item quantity
const validateUpdateCartItemQuantity = [

    body("productID")
        .notEmpty()
        .withMessage("Product ID is required.")
        .isMongoId()
        .withMessage("Invalid product ID."),

    body("size")
        .notEmpty()
        .withMessage("Size is required.")
        .isIn(Sizes)
        .withMessage("Invalid size."),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required.")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1.")

];

// @Ali: Remove item from cart
const validateRemoveCartItem = [

    body("productID")
        .notEmpty()
        .withMessage("Product ID is required.")
        .isMongoId()
        .withMessage("Invalid product ID."),

    body("size")
        .notEmpty()
        .withMessage("Size is required.")
        .isIn(Sizes)
        .withMessage("Invalid size.")

];

module.exports = {
    validateAddProductToCart,
    validateUpdateCartItemQuantity,
    validateRemoveCartItem
};