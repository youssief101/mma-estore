const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
    getAllGiftCards
} = require("../controllers/giftCard.controller");

router.get(
    "/",
    authenticate,
    authorize("Admin"),
    getAllGiftCards
);

module.exports = router;