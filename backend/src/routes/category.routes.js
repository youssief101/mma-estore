const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const express = require("express");
const router = express.Router();

const {getAllCategories, getCategoryById, createCategory} = require("../controllers/category.controller");


router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);
router.post("/", authenticate, authorize("Admin"), createCategory);

module.exports = router;