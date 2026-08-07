const Product = require("../models/Product");
const { mockProducts } = require("../utils/fallbackStore");

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
                isActive: true,
                "display.featured": true
            }).limit(8),

            Product.find({
                isActive: true,
                "display.newArrival": true
            })
                .sort({ createdAt: -1 })
                .limit(8),

            Product.find({
                isActive: true,
                "display.championGear": true
            }).limit(8),

            Product.find({
                isActive: true,
                "display.trending": true
            }).limit(8),

            Product.find({
                isActive: true,
                onSale: true
            }).limit(8)

        ]);

        const hasAnyData = (featuredProducts && featuredProducts.length > 0) ||
                           (newArrivals && newArrivals.length > 0);

        return res.status(200).json({
            success: true,
            data: {
                featuredProducts: hasAnyData ? featuredProducts : mockProducts,
                newArrivals: hasAnyData ? newArrivals : mockProducts,
                championGear: hasAnyData ? championGear : mockProducts,
                trendingProducts: hasAnyData ? trendingProducts : mockProducts,
                saleProducts: hasAnyData ? saleProducts : mockProducts
            }
        });

    } catch (error) {

        console.warn("[AI Studio] getHomePage fallback:", error.message);

        return res.status(200).json({
            success: true,
            data: {
                featuredProducts: mockProducts,
                newArrivals: mockProducts,
                championGear: mockProducts,
                trendingProducts: mockProducts,
                saleProducts: mockProducts
            }
        });

    }
};

module.exports = {
    getHomePage
};
