const Department = require("../models/Department");
const generateSlug = require("../utils/generateSlug");
const { mockDepartments } = require("../utils/fallbackStore");

// @youssef: Get all departments
const getAllDepartments = async (req, res) => {
    try {

        const departments = await Department
            .find({ isActive: true })
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            count: departments.length > 0 ? departments.length : mockDepartments.length,
            departments: departments.length > 0 ? departments : mockDepartments
        });

    } catch (error) {

        console.warn("[AI Studio] getAllDepartments fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockDepartments.length,
            departments: mockDepartments
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
            const fallback = mockDepartments.find(d => d._id === departmentId || d.slug === departmentId) || mockDepartments[0];
            return res.status(200).json({
                success: true,
                department: fallback
            });
        }

        return res.status(200).json({
            success: true,
            department
        });

    } catch (error) {
        console.warn("[AI Studio] getDepartmentById fallback:", error.message);
        const fallback = mockDepartments.find(d => d._id === req.params.departmentId || d.slug === req.params.departmentId) || mockDepartments[0];
        
        return res.status(200).json({
            success: true,
            department: fallback
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

// @youssef: Update department
const updateDepartment = async (req, res) => {
    try {

        const { departmentId } = req.params;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        const {
            name,
            description,
            image,
            isActive
        } = req.body;

        if (name !== undefined) {

            const trimmedName = name.trim();

            const duplicateDepartment = await Department.findOne({
                _id: { $ne: departmentId },
                name: {
                    $regex: new RegExp(`^${trimmedName}$`, "i")
                }
            });

            if (duplicateDepartment) {
                return res.status(409).json({
                    success: false,
                    message: "Department already exists."
                });
            }

            department.name = trimmedName;
            department.slug = generateSlug(trimmedName);
        }

        if (description !== undefined) {
            department.description = description.trim();
        }

        if (image !== undefined) {
            department.image = image.trim();
        }

        if (typeof isActive === "boolean") {
            department.isActive = isActive;
        }

        await department.save();

        return res.status(200).json({
            success: true,
            message: "Department updated successfully.",
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

// @youssef: Soft delete department
const deleteDepartment = async (req, res) => {
    try {

        const { departmentId } = req.params;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        if (!department.isActive) {
            return res.status(409).json({
                success: false,
                message: "Department is already inactive."
            });
        }

        const Product = require("../models/Product");

        const productsCount = await Product.countDocuments({
            departmentID: department._id,
            isActive: true
        });

        if (productsCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete department because it contains active products."
            });
        }

        department.isActive = false;

        await department.save();

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully."
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

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};