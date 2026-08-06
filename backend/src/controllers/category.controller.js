const Category = require("../models/Category");
const generateSlug = require("../utils/generateSlug");
const Product = require("../models/Product");

// @youssef: Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isActive: true
        }).sort({
            name: 1
        });        
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
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// @youssef: Create category
const createCategory = async (req, res) => {
    try {

        const {
            name,
            description,
            image
        } = req.body;

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

// @youssef: Update category
const updateCategory = async (req, res) => {
    try {

        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        const {
            name,
            description,
            image,
            isActive
        } = req.body;

        if (name) {

            const trimmedName = name.trim();

            const duplicateCategory = await Category.findOne({
                _id: { $ne: categoryId },
                name: {
                    $regex: new RegExp(`^${trimmedName}$`, "i")
                }
            });

            if (duplicateCategory) {
                return res.status(409).json({
                    success: false,
                    message: "Category already exists."
                });
            }

            category.name = trimmedName;
            category.slug = generateSlug(trimmedName);
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        if (image !== undefined) {
            category.image = image.trim();
        }

        if (typeof isActive === "boolean") {
            category.isActive = isActive;
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully.",
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

// @youssef: Soft delete category
const deleteCategory = async (req, res) => {
    try {

        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        if (!category.isActive) {
            return res.status(409).json({
                success: false,
                message: "Category is already inactive."
            });
        }

        const productsCount = await Product.countDocuments({
            categoryID: category._id,
            isActive: true
        });

        if (productsCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete category because it is assigned to active products."
            });
        }

        category.isActive = false;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully."
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
    createCategory,
    updateCategory,
    deleteCategory,
};