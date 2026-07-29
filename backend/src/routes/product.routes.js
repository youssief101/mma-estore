const express = require("express");

const router = express.Router();

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
  getAllProducts,
  searchProducts,
  filterProducts,
  getFeaturedProducts,
  getChampionGearProducts,
  getRelatedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/filter", filterProducts);
router.get("/featured", getFeaturedProducts);
router.get("/champion-gear", getChampionGearProducts);
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorize("Admin"), createProduct);
router.put("/:id", authenticate, authorize("Admin"), updateProduct);
router.delete("/:id", authenticate, authorize("Admin"), deleteProduct);

module.exports = router;
