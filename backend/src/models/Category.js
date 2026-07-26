// @youssef: the category model is for modeling the types of the products in the store
//          for example t-shirts, shorts, belts, etc ...

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            maxlength: [100, "Category name cannot exceed 100 characters"]
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

module.exports = mongoose.model("Category", categorySchema);

/*
    @youssef: example of the schema structure
    {
        "_id": "...",
        "name": "T-Shirts",
        "description": "Official UFC T-Shirts",
        "image": "/uploads/categories/tshirts.png",
        "createdAt": "...",
        "updatedAt": "..."
    }
*/