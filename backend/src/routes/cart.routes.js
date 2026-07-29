const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");

const {
    getUserCart,
    addProductToCart,
    updateCartItemQuantity
} = require("../controllers/cart.controller");

router.get("/", authenticate, getUserCart);
router.post("/", authenticate, addProductToCart);
router.put("/", authenticate, updateCartItemQuantity);

module.exports = router;