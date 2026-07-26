const Category = require("../models/Category");
const generateSlug = require("../utils/generateSlug");


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

// @youssef: Create category
// @youssef: Create category
const createCategory = async (req, res) => {
    try {

        const {
            name,
            description,
            image
        } = req.body;

        if (!name || !description || !image) {
            return res.status(400).json({
                success: false,
                message: "Name, description and image are required."
            });
        }

        const trimmedName = name.trim();

        const existingCategory = await Category.findOne({
            name: {
                $regex: new RegExp(`^${trimmedName}$`, "i")
            }
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists."
            });
        }

        const slug = generateSlug(trimmedName);

        const category = await Category.create({
            name: trimmedName,
            slug,
            description: description.trim(),
            image: image.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category
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
    getAllCategories,
    getCategoryById,
    createCategory
};