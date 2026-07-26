const express = require("express");

const {
    getAllBrands,
    getBrandById
} = require("../controllers/brand.controller");

const router = express.Router();

router.get("/", getAllBrands);
router.get("/:brandId", getBrandById);

module.exports = router;