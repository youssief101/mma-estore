const express = require("express");
const router = express.Router();

const {getAllCategories, getCategoryById} = require("../controllers/category.controller");


router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);


module.exports = router;