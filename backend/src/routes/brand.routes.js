const express = require("express");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} = require("../controllers/brand.controller");

const {
    validateGetAllBrands,
    validateGetBrandById,
    validateCreateBrand,
    validateUpdateBrand,
    validateDeleteBrand
} = require("../validators/brand.validator");

const router = express.Router();

// Public
router.get(
    "/",
    validateGetAllBrands,
    validate,
    getAllBrands
);

router.get(
    "/:brandId",
    validateGetBrandById,
    validate,
    getBrandById
);

// Admin
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    validateCreateBrand,
    validate,
    createBrand
);

router.put(
    "/:brandId",
    authenticate,
    authorize("Admin"),
    validateUpdateBrand,
    validate,
    updateBrand
);

router.delete(
    "/:brandId",
    authenticate,
    authorize("Admin"),
    validateDeleteBrand,
    validate,
    deleteBrand
);

module.exports = router;