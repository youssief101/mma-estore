const { body, param } = require("express-validator");

const createGiftCardValidation = [
    body("code")
        .trim()
        .notEmpty()
        .withMessage("Gift card code is required.")
        .isLength({ min: 6, max: 30 })
        .withMessage("Gift card code must be between 6 and 30 characters."),

    body("amount")
        .notEmpty()
        .withMessage("Gift card amount is required.")
        .isFloat({ gt: 0 })
        .withMessage("Gift card amount must be greater than 0."),

    body("expirationDate")
        .notEmpty()
        .withMessage("Expiration date is required.")
        .isISO8601()
        .withMessage("Invalid expiration date.")
        .custom(value => {
            if (new Date(value) <= new Date()) {
                throw new Error("Expiration date must be in the future.");
            }
            return true;
        })
];

const updateGiftCardValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid gift card ID."),

    body("amount")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Gift card amount must be greater than 0."),

    body("expirationDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid expiration date.")
        .custom(value => {
            if (new Date(value) <= new Date()) {
                throw new Error("Expiration date must be in the future.");
            }
            return true;
        }),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be true or false.")
];

const giftCardIdValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid gift card ID.")
];

module.exports = {
    createGiftCardValidation,
    updateGiftCardValidation,
    giftCardIdValidation
};