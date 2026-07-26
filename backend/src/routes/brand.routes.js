const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
    getAllBrands,
    getBrandById,
    createBrand
} = require("../controllers/brand.controller");

const router = express.Router();

router.get("/", getAllBrands);
router.get("/:brandId", getBrandById);
router.post("/", authenticate, authorize("Admin"), createBrand);

module.exports = router;