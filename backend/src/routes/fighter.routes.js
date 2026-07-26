const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
    getAllFighters,
    getFighterById,
    createFighter
} = require("../controllers/fighter.controller");

const router = express.Router();

router.get("/", getAllFighters);
router.get("/:fighterId", getFighterById);
router.post("/", authenticate, authorize("Admin"), createFighter);

module.exports = router;