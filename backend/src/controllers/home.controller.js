const Product = require("../models/Product");
const Event = require("../models/Event");
const Fighter = require("../models/Fighter");

const getHeroBanner = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      banner: {
        title: "Official UFC Store",
        subtitle: "Shop the latest UFC merchandise",
        image: "/uploads/banners/home-banner.jpg",
        buttonText: "Shop Now",
        buttonLink: "/products",
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      active: true,
      "display.featured": true,
    })
      .populate("brandID", "name")
      .populate("categoryID", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get trending products
const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      active: true,
      "display.trending": true,
    })
      .populate("brandID", "name")
      .populate("categoryID", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get champion gear products
const getChampionGear = async (req, res) => {
  try {
    const products = await Product.find({
      active: true,
      "display.championGear": true,
    })
      .populate("brandID", "name")
      .populate("categoryID", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get new arrival products
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      active: true,
      "display.newArrival": true,
    })
      .populate("brandID", "name")
      .populate("categoryID", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      eventDate: {
        $gte: new Date(),
      },
    }).sort({
      eventDate: 1,
    });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get featured fighters
const getFeaturedFighters = async (req, res) => {
  try {
    const fighters = await Fighter.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: fighters.length,
      fighters,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Get featured events
const getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({
      eventDate: {
        $gte: new Date(),
      },
    })
      .sort({ eventDate: 1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getHeroBanner,
  getFeaturedProducts,
  getTrendingProducts,
  getChampionGear,
  getNewArrivals,
  getUpcomingEvents,
  getFeaturedFighters,
  getFeaturedEvents,
};
