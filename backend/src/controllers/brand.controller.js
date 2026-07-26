const Brand = require("../models/Brand");

// @youssef: Get all brands
const getAllBrands = async (req, res) => {
    try {

        const brands = await Brand
            .find({ isActive: true })
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            count: brands.length,
            brands
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
    getAllBrands
};