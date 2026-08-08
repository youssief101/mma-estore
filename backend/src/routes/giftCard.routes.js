const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    createGiftCardValidation,
    updateGiftCardValidation,
    giftCardIdValidation
} = require("../validators/giftCard.validator");

const {
    getAllGiftCards,
    getGiftCardById,
    verifyGiftCard,
    createGiftCard,
    updateGiftCard,
    softDeleteGiftCard
} = require("../controllers/giftCard.controller");

router.get("/verify/:code", verifyGiftCard);

router.get(
    "/",
    authenticate,
    authorize("Admin"),
    getAllGiftCards
);

router.get(
    "/:id",
    authenticate,
    authorize("Admin"),
    giftCardIdValidation,
    validate,
    getGiftCardById
);

router.post(
    "/",
    authenticate,
    authorize("Admin"),
    createGiftCardValidation,
    validate,
    createGiftCard
);

router.put(
    "/:id",
    authenticate,
    authorize("Admin"),
    updateGiftCardValidation,
    validate,
    updateGiftCard
);

router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    giftCardIdValidation,
    validate,
    softDeleteGiftCard
);

module.exports = router;