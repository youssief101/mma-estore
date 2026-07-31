const express = require("express");

const router = express.Router();

const {
  getHeroBanner,
  getFeaturedProducts,
  getTrendingProducts,
  getChampionGear,
  getNewArrivals,
} = require("../controllers/home.controller");

router.get("/banner", getHeroBanner);
router.get("/featured-products", getFeaturedProducts);
router.get("/trending-products", getTrendingProducts);
router.get("/champion-gear", getChampionGear);
router.get("/new-arrivals", getNewArrivals);

module.exports = router;
