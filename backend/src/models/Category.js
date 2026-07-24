// @youssef: the category model is for modeling the types of the products in the store
//          for example t-shirts, shorts, belts, etc ...

const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true, // no 'T-Shirts', ' T-Shirts', 'T-shirts  '
            maxLength: [100, "Category name can't exceed 100 chars"]
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: [500, "Description can't exceed 500 chars"]
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