const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const express = require("express");
const router = express.Router();

const {getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory} = require("../controllers/category.controller");


router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);
router.post("/", authenticate, authorize("Admin"), createCategory);
router.put("/:categoryId", authenticate, authorize("Admin"), updateCategory );
router.delete("/:categoryId", authenticate, authorize("Admin"), deleteCategory);

module.exports = router;