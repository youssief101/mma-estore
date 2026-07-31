const express = require("express");

const router = express.Router();

const {
  getHeroBanner,
  getFeaturedProducts,
  getTrendingProducts,
  getChampionGear,
} = require("../controllers/home.controller");

router.get("/banner", getHeroBanner);
router.get("/featured-products", getFeaturedProducts);
router.get("/trending-products", getTrendingProducts);
router.get("/champion-gear", getChampionGear);

module.exports = router;
