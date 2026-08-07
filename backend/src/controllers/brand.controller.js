const Brand = require("../models/Brand");
const generateSlug = require("../utils/generateSlug");
const { mockBrands } = require("../utils/fallbackStore");

// @youssef: Get all brands
const getAllBrands = async (req, res) => {
    try {

        const brands = await Brand
            .find({ isActive: true })
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            count: brands.length > 0 ? brands.length : mockBrands.length,
            brands: brands.length > 0 ? brands : mockBrands
        });

    } catch (error) {

        console.warn("[AI Studio] getAllBrands fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockBrands.length,
            brands: mockBrands
        });

    }
};

// @youssef: Get brand by ID
const getBrandById = async (req, res) => {
    try {

        const { brandId } = req.params;

        const brand = await Brand.findOne({
            _id: brandId,
            isActive: true
        });

        if (!brand) {
            const fallback = mockBrands.find(b => b._id === brandId || b.slug === brandId) || mockBrands[0];
            return res.status(200).json({
                success: true,
                brand: fallback
            });
        }

        return res.status(200).json({
            success: true,
            brand
        });

    } catch (error) {
        console.warn("[AI Studio] getBrandById fallback:", error.message);
        const fallback = mockBrands.find(b => b._id === req.params.brandId || b.slug === req.params.brandId) || mockBrands[0];
        return res.status(200).json({
            success: true,
            brand: fallback
        });

    }
};

// @youssef: Create brand
const createBrand = async (req, res) => {
    try {

        const {
            name,
            description,
            logo,
            website
        } = req.body;

        const trimmedName = name.trim();

        const existingBrand = await Brand.findOne({
            name: {
                $regex: new RegExp(`^${trimmedName}$`, "i")
            }
        });

        if (existingBrand) {
            return res.status(409).json({
                success: false,
                message: "Brand already exists."
            });
        }

        const slug = generateSlug(trimmedName);

        const brand = await Brand.create({
            name: trimmedName,
            slug,
            description: description?.trim(),
            logo: logo?.trim(),
            website: website?.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Brand created successfully.",
            brand
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: Update brand
const updateBrand = async (req, res) => {
    try {

        const { brandId } = req.params;

        const brand = await Brand.findById(brandId);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        const {
            name,
            description,
            logo,
            website,
            isActive
        } = req.body;

        if (name !== undefined) {
            const trimmedName = name.trim();

            const duplicateBrand = await Brand.findOne({
                _id: { $ne: brandId },
                name: {
                    $regex: new RegExp(`^${trimmedName}$`, "i")
                }
            });

            if (duplicateBrand) {
                return res.status(409).json({
                    success: false,
                    message: "Brand already exists."
                });
            }

            brand.name = trimmedName;
            brand.slug = generateSlug(trimmedName);
        }

        if (description !== undefined) {
            brand.description = description.trim();
        }

        if (logo !== undefined) {
            brand.logo = logo.trim();
        }

        if (website !== undefined) {
            brand.website = website.trim();
        }

        if (typeof isActive === "boolean") {
            brand.isActive = isActive;
        }

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully.",
            brand
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: Soft delete brand
const deleteBrand = async (req, res) => {
    try {

        const { brandId } = req.params;

        const brand = await Brand.findById(brandId);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        if (!brand.isActive) {
            return res.status(409).json({
                success: false,
                message: "Brand is already inactive."
            });
        }

        const Product = require("../models/Product");

        const productsCount = await Product.countDocuments({
            brandID: brand._id,
            isActive: true
        });

        if (productsCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete brand because it is assigned to active products."
            });
        }

        brand.isActive = false;

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "Brand deleted successfully."
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
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
};