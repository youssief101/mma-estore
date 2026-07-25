// @youssef: the address model is an extension of logical arrangement of the 
//          other logical models to support multiple user addresses, and enable 
//          a user to edit an address including all address functionalities

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fullName: {
            type: String,
            required: [true, "Recipient name is required"],
            trim: true,
            maxlength: [100, "Recipient name cannot exceed 100 characters"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            maxlength: [20, "Phone number cannot exceed 20 characters"]
        },
        country: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "Country cannot exceed 100 characters"]
        },
        governorate: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "Governorate cannot exceed 100 characters"]
        },
        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "City cannot exceed 100 characters"]
        },
        street: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, "Street cannot exceed 200 characters"]
        },
        building: {
            type: String,
            required: true,
            trim: true,
            maxlength: [50, "Building cannot exceed 50 characters"]
        },
        apartment: {
            type: String,
            default: "",
            trim: true,
            maxlength: [50, "Apartment cannot exceed 50 characters"]
        },
        postalCode: {
            type: String,
            default: "",
            trim: true,
            maxlength: [20, "Postal code cannot exceed 20 characters"]
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Address", addressSchema);