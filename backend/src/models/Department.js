// @youssef: the department models the different departments
//          of the existing merchendise for example footwear, jerseys, etc ..

const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required"],
            unique: true,
            trim: true,
            maxlength: [100, "Department name can't exceed 100 chars"]
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, "Description can't exceed 500 chars"]
        }, 
        image: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("Department", departmentSchema);

// a document example
/*
    {
        "_id": "...",
        "name": "Equipment",
        "description": "Official UFC training equipment",
        "image": "/uploads/departments/equipment.png",
        "createdAt": "...",
        "updatedAt": "..."
    }
*/