const express = require("express");

const router = express.Router();

const {
    getHeroBanner
} = require("../controllers/home.controller");

router.get(
    "/banner",
    getHeroBanner
);

module.exports = router;
