// @youssef: Brand model
// Represents the manufacturer or official merchandise brand
// (e.g. UFC, Venum, Hayabusa, Fanatics)

const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand name is required"],
            unique: true,
            trim: true,
            maxlength: [100, "Brand name cannot exceed 100 characters"]
        },

        slug: {
            type: String,
            required: [true, "Brand slug is required"],
            unique: true,
            trim: true,
            lowercase: true
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: ""
        },

        logo: {
            type: String,
            trim: true,
            default: ""
        },

        website: {
            type: String,
            trim: true,
            default: ""
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

module.exports = mongoose.model("Brand", brandSchema);

/*
    @youssef: Example document

    {
        "_id": "...",
        "name": "UFC",
        "slug": "ufc",
        "description": "Official UFC merchandise",
        "logo": "/uploads/brands/ufc.png",
        "website": "https://www.ufc.com",
        "isActive": true,
        "createdAt": "...",
        "updatedAt": "..."
    }
*/