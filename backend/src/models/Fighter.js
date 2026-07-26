const mongoose = require("mongoose");
const { FighterGenders } = require("../constants/enums");

const fighterSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"]
        },
        nickname: {
            type: String,
            trim: true,
            maxlength: [100, "Nickname cannot exceed 100 characters"],
            default: ""
        },
        gender: {
            type: String,
            required: true,
            enum: FighterGenders
        },
        weightClass: {
            type: String,
            required: [true, "Weight class is required"],
            trim: true,
            maxlength: [50, "Weight class cannot exceed 50 characters"]
        },
        ranking: {
            type: Number,
            default: null,
            min: [1, "Ranking must be at least 1"]
        },
        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
            maxlength: [100, "Country cannot exceed 100 characters"]
        },
        image: {
            type: String,
            required: [true, "Fighter image is required"],
            trim: true
        },
        champion: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Fighter", fighterSchema);