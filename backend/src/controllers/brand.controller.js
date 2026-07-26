const Brand = require("../models/Brand");
const generateSlug = require("../utils/generateSlug");

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

// @youssef: Get brand by ID
const getBrandById = async (req, res) => {
    try {

        const { brandId } = req.params;

        const brand = await Brand.findOne({
            _id: brandId,
            isActive: true
        });

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        return res.status(200).json({
            success: true,
            brand
        });

    } catch (error) {

        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid brand ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
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

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Brand name is required."
            });
        }

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
            description: description?.trim() ?? "",
            logo: logo?.trim() ?? "",
            website: website?.trim() ?? ""
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

module.exports = {
    getAllBrands,
    getBrandById,
    createBrand
};