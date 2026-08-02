const { body, param } = require("express-validator");

const {
    PaymentMethods,
    OrderStatuses
} =require("../constants/enums");


// @youssef: Create Order

const createOrderValidation = [

    body("shippingAddress")
        .exists().withMessage("Shipping address is required.")
        .isObject().withMessage("Shipping address must be an object."),

    body("shippingAddress.firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ max: 100 })
        .withMessage("First name cannot exceed 100 characters."),

    body("shippingAddress.lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ max: 100 })
        .withMessage("Last name cannot exceed 100 characters."),

    body("shippingAddress.phone")
        .trim()
        .notEmpty()
        .withMessage("Phone is required.")
        .isLength({ min: 8, max: 20 })
        .withMessage("Invalid phone number."),

    body("shippingAddress.country")
        .trim()
        .notEmpty()
        .withMessage("Country is required."),

    body("shippingAddress.city")
        .trim()
        .notEmpty()
        .withMessage("City is required."),

    body("shippingAddress.street")
        .trim()
        .notEmpty()
        .withMessage("Street is required."),

    body("shippingAddress.building")
        .optional()
        .trim(),

    body("shippingAddress.apartment")
        .optional()
        .trim(),

    body("shippingAddress.postalCode")
        .optional()
        .trim(),

    body("paymentMethod")
        .notEmpty()
        .withMessage("Payment method is required.")
        .isIn(PaymentMethods)
        .withMessage(
            `Payment method must be one of: ${PaymentMethods.join(", ")}`
        )
];


// @youssef: Update Order Status

const updateOrderStatusValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid order ID."),

    body("orderStatus")
        .notEmpty()
        .withMessage("Order status is required.")
        .isIn(OrderStatuses)
        .withMessage(
            `Order status must be one of: ${OrderStatuses.join(", ")}`
        )
];


// @youssef: Order ID

const orderIdValidation = [

    param("id")
        .isMongoId()
        .withMessage("Invalid order ID.")
];


// @youssef: Order Number

const orderNumberValidation = [

    param("orderNumber")
        .isInt({ min: 1001 })
        .withMessage("Invalid order number.")
];

module.exports = {

    createOrderValidation,

    updateOrderStatusValidation,

    orderIdValidation,

    orderNumberValidation
};