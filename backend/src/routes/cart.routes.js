const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");

const {
    getUserCart,
    addProductToCart,
    updateCartItemQuantity,
    removeCartItem
} = require("../controllers/cart.controller");

router.get("/", authenticate, getUserCart);
router.post("/", authenticate, addProductToCart);
router.put("/", authenticate, updateCartItemQuantity);
router.delete("/", authenticate, removeCartItem);

module.exports = router;