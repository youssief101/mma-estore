const express = require("express");

const router = express.Router();

const {
  getHeroBanner,
  getFeaturedProducts,
} = require("../controllers/home.controller");

router.get("/banner", getHeroBanner);
router.get("/featured-products", getFeaturedProducts);

module.exports = router;
