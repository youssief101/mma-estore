const express = require("express");

const {
    getAllFighters,
    getFighterById
} = require("../controllers/fighter.controller");

const router = express.Router();

router.get("/", getAllFighters);
router.get("/:fighterId", getFighterById);

module.exports = router;