const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    createOrderValidation,
    updateOrderStatusValidation,
    orderIdValidation,
    orderNumberValidation
} = require("../validators/order.validator");

const {
    getUserOrders,
    getOrderById,
    findOrder,
    createOrder,
    updateOrderStatus,
    getAllOrders,
    cancelOrder
} = require("../controllers/order.controller");

router.get("/my-orders", authenticate, getUserOrders);

router.get(
    "/track/:orderNumber",
    authenticate,
    orderNumberValidation,
    validate,
    findOrder
);

router.post(
    "/",
    authenticate,
    createOrderValidation,
    validate,
    createOrder
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("Admin"),
    updateOrderStatusValidation,
    validate,
    updateOrderStatus
);

router.get(
    "/",
    authenticate,
    authorize("Admin"),
    getAllOrders
);

router.patch(
    "/:id/cancel",
    authenticate,
    orderIdValidation,
    validate,
    cancelOrder
);

router.get(
    "/:id",
    authenticate,
    orderIdValidation,
    validate,
    getOrderById
);

module.exports = router;