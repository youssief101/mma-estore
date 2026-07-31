const Product = require("../models/Product");

const getHomePage = async (req, res) => {
    try {

        const [
            featuredProducts,
            newArrivals,
            championGear,
            trendingProducts,
            saleProducts
        ] = await Promise.all([

            Product.find({
                active: true,
                "display.featured": true
            }).limit(8),

            Product.find({
                active: true,
                "display.newArrival": true
            })
                .sort({ createdAt: -1 })
                .limit(8),

            Product.find({
                active: true,
                "display.championGear": true
            }).limit(8),

            Product.find({
                active: true,
                "display.trending": true
            }).limit(8),

            Product.find({
                active: true,
                onSale: true
            }).limit(8)

        ]);

        return res.status(200).json({
            success: true,
            data: {
                featuredProducts,
                newArrivals,
                championGear,
                trendingProducts,
                saleProducts
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

module.exports = {
    getHomePage
};