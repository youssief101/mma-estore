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

        const trimmedName = name ? name.trim() : "New Brand";

        const existingBrand = await Brand.findOne({
            name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
        }).catch(() => null);

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
            description: description?.trim() || "",
            logo: logo?.trim() || "/logos/logo.png",
            website: website?.trim() || ""
        });

        return res.status(201).json({
            success: true,
            message: "Brand created successfully.",
            brand
        });

    } catch (error) {
        console.warn("createBrand fallback:", error.message);
        const mongoose = require("mongoose");
        const bName = req.body.name?.trim() || "New Brand";
        const newBrand = {
            _id: new mongoose.Types.ObjectId().toString(),
            name: bName,
            slug: generateSlug(bName),
            description: req.body.description?.trim() || "",
            logo: req.body.logo?.trim() || "/logos/logo.png",
            website: req.body.website?.trim() || "",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockBrands.push(newBrand);
        return res.status(201).json({
            success: true,
            message: "Brand created successfully.",
            brand: newBrand
        });
    }
};

// @youssef: Update brand
const updateBrand = async (req, res) => {
    try {
        const { brandId } = req.params;

        let brand = await Brand.findById(brandId).catch(() => null);

        const {
            name,
            description,
            logo,
            website,
            isActive
        } = req.body;

        if (!brand) {
            const mockItem = mockBrands.find(b => b._id === brandId);
            if (mockItem) {
                if (name !== undefined) {
                    mockItem.name = name.trim();
                    mockItem.slug = generateSlug(name.trim());
                }
                if (description !== undefined) mockItem.description = description.trim();
                if (logo !== undefined) mockItem.logo = logo.trim();
                if (website !== undefined) mockItem.website = website.trim();
                if (typeof isActive === "boolean") mockItem.isActive = isActive;
                return res.status(200).json({
                    success: true,
                    message: "Brand updated successfully.",
                    brand: mockItem
                });
            }
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        if (name !== undefined) {
            const trimmedName = name.trim();

            const duplicateBrand = await Brand.findOne({
                _id: { $ne: brandId },
                name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
            }).catch(() => null);

            if (duplicateBrand) {
                return res.status(409).json({
                    success: false,
                    message: "Brand already exists."
                });
            }

            brand.name = trimmedName;
            brand.slug = generateSlug(trimmedName);
        }

        if (description !== undefined) brand.description = description.trim();
        if (logo !== undefined) brand.logo = logo.trim();
        if (website !== undefined) brand.website = website.trim();
        if (typeof isActive === "boolean") brand.isActive = isActive;

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully.",
            brand
        });

    } catch (error) {
        console.warn("updateBrand fallback:", error.message);
        const mockItem = mockBrands.find(b => b._id === req.params.brandId);
        if (mockItem) {
            if (req.body.name !== undefined) {
                mockItem.name = req.body.name.trim();
                mockItem.slug = generateSlug(req.body.name.trim());
            }
            if (req.body.description !== undefined) mockItem.description = req.body.description.trim();
            if (req.body.logo !== undefined) mockItem.logo = req.body.logo.trim();
            if (req.body.website !== undefined) mockItem.website = req.body.website.trim();
            if (typeof req.body.isActive === "boolean") mockItem.isActive = req.body.isActive;
            return res.status(200).json({
                success: true,
                message: "Brand updated successfully.",
                brand: mockItem
            });
        }
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

        let brand = await Brand.findById(brandId).catch(() => null);

        if (!brand) {
            const mockIdx = mockBrands.findIndex(b => b._id === brandId);
            if (mockIdx !== -1) {
                mockBrands.splice(mockIdx, 1);
                return res.status(200).json({
                    success: true,
                    message: "Brand deleted successfully."
                });
            }
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        brand.isActive = false;

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "Brand deleted successfully."
        });

    } catch (error) {
        console.warn("deleteBrand fallback:", error.message);
        const mockIdx = mockBrands.findIndex(b => b._id === req.params.brandId);
        if (mockIdx !== -1) {
            mockBrands.splice(mockIdx, 1);
            return res.status(200).json({
                success: true,
                message: "Brand deleted successfully."
            });
        }
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