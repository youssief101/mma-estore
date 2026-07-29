const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required"],
            unique: true,
            trim: true,
            maxlength: [100, "Department name cannot exceed 100 characters"]
        },

        slug: {
            type: String,
            required: [true, "Department slug is required"],
            unique: true,
            trim: true,
            lowercase: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },

        image: {
            type: String,
            required: true,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Department", departmentSchema);

