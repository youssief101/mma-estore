const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");

const {
    getUserCart,
    addProductToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
} = require("../controllers/cart.controller");

router.get("/", authenticate, getUserCart);
router.post("/", authenticate, addProductToCart);
router.put("/", authenticate, updateCartItemQuantity);
router.delete("/", authenticate, removeCartItem);
router.delete("/clear", authenticate, clearCart);
module.exports = router;