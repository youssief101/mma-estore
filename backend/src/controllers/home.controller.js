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

module.exports = {
  getHeroBanner,
};
