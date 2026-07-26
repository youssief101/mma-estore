const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
    getAllFighters,
    getFighterById,
    createFighter,
    updateFighter,
    deleteFighter
} = require("../controllers/fighter.controller");

const router = express.Router();

router.get("/", getAllFighters);
router.get("/:fighterId", getFighterById);
router.post("/", authenticate, authorize("Admin"), createFighter);
router.put("/:fighterId", authenticate, authorize("Admin"), updateFighter);
router.delete("/:fighterId", authenticate, authorize("Admin"), deleteFighter);

module.exports = router;