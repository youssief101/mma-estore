const express = require("express");

const router = express.Router();

const {
  getHeroBanner,
  getFeaturedProducts,
  getTrendingProducts,
  getChampionGear,
  getNewArrivals,
  getUpcomingEvents,
  getFeaturedFighters,
} = require("../controllers/home.controller");

router.get("/banner", getHeroBanner);
router.get("/featured-products", getFeaturedProducts);
router.get("/trending-products", getTrendingProducts);
router.get("/champion-gear", getChampionGear);
router.get("/new-arrivals", getNewArrivals);
router.get("/upcoming-events", getUpcomingEvents);
router.get("/featured-fighters", getFeaturedFighters);

module.exports = router;
