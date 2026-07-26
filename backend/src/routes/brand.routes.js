const express = require("express");

const {
    getAllBrands
} = require("../controllers/brand.controller");

const router = express.Router();

router.get("/", getAllBrands);

module.exports = router;