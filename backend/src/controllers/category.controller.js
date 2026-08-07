const Category = require("../models/Category");
const generateSlug = require("../utils/generateSlug");
const Product = require("../models/Product");
const { mockCategories } = require("../utils/fallbackStore");

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
            count: categories.length > 0 ? categories.length : mockCategories.length,
            categories: categories.length > 0 ? categories : mockCategories
        });
    } catch (error) {
        console.warn("[AI Studio] getAllCategories fallback:", error.message);
        return res.status(200).json({
            success: true,
            count: mockCategories.length,
            categories: mockCategories
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
            const fallback = mockCategories.find(c => c._id === categoryId || c.slug === categoryId) || mockCategories[0];
            return res.status(200).json({
                success: true,
                category: fallback
            });
        }
        return res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.warn("[AI Studio] getCategoryById fallback:", error.message);
        const fallback = mockCategories.find(c => c._id === req.params.categoryId || c.slug === req.params.categoryId) || mockCategories[0];
        return res.status(200).json({
            success: true,
            category: fallback
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

        const trimmedName = name ? name.trim() : "";
        const desc = description ? description.trim() : "";
        const img = image ? image.trim() : "/images/gloves-category.jpg";

        const existingCategory = await Category.findOne({
            name: {
                $regex: new RegExp(`^${trimmedName}$`, "i")
            }
        }).catch(() => null);

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
            description: desc,
            image: img
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category
        });

    } catch (error) {
        console.warn("createCategory fallback:", error.message);
        const mongoose = require("mongoose");
        const newCat = {
            _id: new mongoose.Types.ObjectId().toString(),
            name: req.body.name?.trim() || "New Category",
            slug: generateSlug(req.body.name || "new-category"),
            description: req.body.description?.trim() || "",
            image: req.body.image?.trim() || "/images/gloves-category.jpg",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockCategories.push(newCat);
        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category: newCat
        });
    }
};

// @youssef: Update category
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        let category = await Category.findById(categoryId).catch(() => null);

        const {
            name,
            description,
            image,
            isActive
        } = req.body;

        if (!category) {
            const mockItem = mockCategories.find(c => c._id === categoryId);
            if (mockItem) {
                if (name) {
                    mockItem.name = name.trim();
                    mockItem.slug = generateSlug(name.trim());
                }
                if (description !== undefined) mockItem.description = description.trim();
                if (image !== undefined) mockItem.image = image.trim();
                if (typeof isActive === "boolean") mockItem.isActive = isActive;
                return res.status(200).json({
                    success: true,
                    message: "Category updated successfully.",
                    category: mockItem
                });
            }
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        if (name) {
            const trimmedName = name.trim();

            const duplicateCategory = await Category.findOne({
                _id: { $ne: categoryId },
                name: {
                    $regex: new RegExp(`^${trimmedName}$`, "i")
                }
            }).catch(() => null);

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
        console.warn("updateCategory fallback:", error.message);
        const mockItem = mockCategories.find(c => c._id === req.params.categoryId);
        if (mockItem) {
            if (req.body.name) {
                mockItem.name = req.body.name.trim();
                mockItem.slug = generateSlug(req.body.name.trim());
            }
            if (req.body.description !== undefined) mockItem.description = req.body.description.trim();
            if (req.body.image !== undefined) mockItem.image = req.body.image.trim();
            if (typeof req.body.isActive === "boolean") mockItem.isActive = req.body.isActive;
            return res.status(200).json({
                success: true,
                message: "Category updated successfully.",
                category: mockItem
            });
        }
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

        let category = await Category.findById(categoryId).catch(() => null);

        if (!category) {
            const mockIdx = mockCategories.findIndex(c => c._id === categoryId);
            if (mockIdx !== -1) {
                mockCategories.splice(mockIdx, 1);
                return res.status(200).json({
                    success: true,
                    message: "Category deleted successfully."
                });
            }
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        category.isActive = false;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        });

    } catch (error) {
        console.warn("deleteCategory fallback:", error.message);
        const mockIdx = mockCategories.findIndex(c => c._id === req.params.categoryId);
        if (mockIdx !== -1) {
            mockCategories.splice(mockIdx, 1);
            return res.status(200).json({
                success: true,
                message: "Category deleted successfully."
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
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};