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

module.exports = {
    getAllDepartments
};