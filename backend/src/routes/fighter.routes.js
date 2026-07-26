const express = require("express");

const {
    getAllFighters
} = require("../controllers/fighter.controller");

const router = express.Router();

router.get("/", getAllFighters);

module.exports = router;