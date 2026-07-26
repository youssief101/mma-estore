const Department = require("../models/Department");

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

module.exports = {
    getAllDepartments,
    getDepartmentById
};