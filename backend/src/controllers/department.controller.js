const Department = require("../models/Department");
const generateSlug = require("../utils/generateSlug");

// @youssef: Get all departments
const getAllDepartments = async (req, res) => {
    try {

        const departments = await Department
            .find({ isActive: true })
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            count: departments.length,
            departments
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: Get department by ID
const getDepartmentById = async (req, res) => {
    try {

        const { departmentId } = req.params;

        const department = await Department.findOne({
            _id: departmentId,
            isActive: true
        });

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        return res.status(200).json({
            success: true,
            department
        });

    } catch (error) {

        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: Create department
const createDepartment = async (req, res) => {
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

        const existingDepartment = await Department.findOne({
            name: {
                $regex: new RegExp(`^${trimmedName}$`, "i")
            }
        });

        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: "Department already exists."
            });
        }

        const slug = generateSlug(trimmedName);

        const department = await Department.create({
            name: trimmedName,
            slug,
            description: description.trim(),
            image: image.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Department created successfully.",
            department
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
    getAllDepartments,
    getDepartmentById,
    createDepartment
};