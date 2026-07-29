const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");

const {
    getUserCart
} = require("../controllers/cart.controller");

router.get("/", authenticate, getUserCart);

module.exports = router;