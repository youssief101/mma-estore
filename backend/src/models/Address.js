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
            maxlength: [100, "Recipient name can't exceed 100 chars"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            // unique: true, // a user can have multiple addresses related to 
            //                  the same phone number
            trim: true,
            maxlength: [20, "Phone number can't exceed 20 chars"]
        },
        country: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "Country can't exceed 100 chars"]
        },
        governorate: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "Governorate can't exceed 100 chars"]
        },
        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, "City can't exceed 100 chars"]
        },
        street: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, "Street can't exceed 200 chars"]
        },
        building: {
            type: String,
            required: true,
            trim: true,
            maxlength: [50, "Building can't exceed 50 chars"]
        },
        aprtment: {
            type: String,
            default: "",
            trim: true,
            maxlength: [50, "Apartment can't exceed 50 chars"]
        },
        postalCode: {
            type: String,
            default: "",
            trim: true,
            maxlength: [20, "Postal code can't exceed 20 chars"]
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