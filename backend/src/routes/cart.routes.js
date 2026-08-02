const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    validateAddProductToCart,
    validateUpdateCartItemQuantity,
    validateRemoveCartItem
} = require("../validators/cart.validator");

const {
    getUserCart,
    addProductToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
} = require("../controllers/cart.controller");

router.get("/", authenticate, getUserCart);

router.post(
    "/",
    authenticate,
    validateAddProductToCart,
    validate,
    addProductToCart
);

router.put(
    "/",
    authenticate,
    validateUpdateCartItemQuantity,
    validate,
    updateCartItemQuantity
);

router.delete(
    "/",
    authenticate,
    validateRemoveCartItem,
    validate,
    removeCartItem
);

router.delete("/clear", authenticate, clearCart);

module.exports = router;