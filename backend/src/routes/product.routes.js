const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    validateGetAllProducts,
    validateSearchProducts,
    validateFilterProducts,
    validateProductId,
    validateCreateProduct,
    validateUpdateProduct
} = require("../validators/product.validator");

const {
    getAllProducts,
    searchProducts,
    filterProducts,
    getFeaturedProducts,
    getChampionGearProducts,
    getNewArrivalProducts,
    getRelatedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");

// ============================================
// Public Routes
// ============================================

router.get(
    "/",
    validateGetAllProducts,
    validate,
    getAllProducts
);

router.get(
    "/search",
    validateSearchProducts,
    validate,
    searchProducts
);

router.get(
    "/filter",
    validateFilterProducts,
    validate,
    filterProducts
);

router.get(
    "/featured",
    getFeaturedProducts
);

router.get(
    "/champion-gear",
    getChampionGearProducts
);

router.get(
    "/new-arrivals",
    getNewArrivalProducts
);

router.get(
    "/:id/related",
    validateProductId,
    validate,
    getRelatedProducts
);

router.get(
    "/:id",
    validateProductId,
    validate,
    getProductById
);

// ============================================
// Admin Routes
// ============================================

router.post(
    "/",
    authenticate,
    authorize("Admin"),
    validateCreateProduct,
    validate,
    createProduct
);

router.put(
    "/:id",
    authenticate,
    authorize("Admin"),
    validateUpdateProduct,
    validate,
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    validateProductId,
    validate,
    deleteProduct
);

module.exports = router;