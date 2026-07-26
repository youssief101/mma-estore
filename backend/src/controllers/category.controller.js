const Category = require("../models/Category");

// @youssef: Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({isActive: true}).sort({ name: 1 });
        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
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
    getAllCategories
};