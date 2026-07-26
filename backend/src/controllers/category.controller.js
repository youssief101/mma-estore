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

// @youssef: Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findOne({
            _id: categoryId,
            isActive: true
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }
        return res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error(error);
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID."
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById
};