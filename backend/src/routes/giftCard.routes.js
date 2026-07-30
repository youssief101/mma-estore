const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {getAllGiftCards,getGiftCardById,createGiftCard,updateGiftCard} = require("../controllers/giftCard.controller");

router.get("/",authenticate,authorize("Admin"),getAllGiftCards);

router.get("/:id",authenticate,authorize("Admin"),getGiftCardById);

router.post( "/",authenticate,authorize("Admin"),createGiftCard);

router.put("/:id", authenticate, authorize("Admin"), updateGiftCard);

module.exports = router;