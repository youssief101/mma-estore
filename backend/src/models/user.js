const mongoose = require("mongoose");
const { Roles } = require("../constants/enums");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            match: [
                /^[a-z0-9_]+$/,
                "Username can contain only lowercase letters, numbers and underscores."
            ]
        },
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
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please enter a valid email address"
            ]
        },        
        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
            minlength: [60, "Invalid password hash"],
            select: false
        },
        role: {
            type: String,
            enum: Roles,
            default: "Customer"
        },
        phone: {
            type: String,
            trim: true,
            maxlength: [20, "Phone number cannot exceed 20 characters"]
        },
        addresses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address"
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date,
            default: null
        },        
    },
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.index({
    username: "text",
    firstName: "text",
    lastName: "text",
    email: "text"
});

userSchema.index({
    role: 1
});

userSchema.index({
    isActive: 1
});

module.exports = mongoose.model("User", userSchema);