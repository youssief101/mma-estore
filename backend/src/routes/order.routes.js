const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");

const { getUserOrders } = require("../controllers/Order.controller");

router.get("/my-orders", authenticate, getUserOrders);

module.exports = router;
