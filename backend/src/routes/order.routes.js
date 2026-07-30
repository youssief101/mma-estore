const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");



const {
  getUserOrders,
  getOrderById,
  findOrder,
  createOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

router.get("/my-orders", authenticate, getUserOrders);
router.get("/track/:orderNumber", authenticate, findOrder);
router.post("/", authenticate, createOrder);
router.patch("/:id/status",authenticate,authorize("Admin"),updateOrderStatus,
);
router.get("/:id", authenticate, getOrderById);

module.exports = router;
