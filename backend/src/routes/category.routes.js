const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/category.controller");

const {
    validateGetCategoryById,
    validateCreateCategory,
    validateUpdateCategory,
    validateDeleteCategory
} = require("../validators/category.validator");

// Public routes
router.get("/", getAllCategories);

router.get(
    "/:categoryId",
    validateGetCategoryById,
    validate,
    getCategoryById
);

// Admin routes
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    validateCreateCategory,
    validate,
    createCategory
);

router.put(
    "/:categoryId",
    authenticate,
    authorize("Admin"),
    validateUpdateCategory,
    validate,
    updateCategory
);

router.delete(
    "/:categoryId",
    authenticate,
    authorize("Admin"),
    validateDeleteCategory,
    validate,
    deleteCategory
);

module.exports = router;