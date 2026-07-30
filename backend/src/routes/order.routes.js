const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");

const {
  getUserOrders,
  getOrderById,
  findOrder,
  createOrder,
} = require("../controllers/order.controller");

router.get("/my-orders", authenticate, getUserOrders);
router.get("/track/:orderNumber", authenticate, findOrder);
router.get("/:id", authenticate, getOrderById);
router.post("/", authenticate, createOrder);

module.exports = router;
