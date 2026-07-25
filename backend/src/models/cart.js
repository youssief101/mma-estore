const mongoose = require("mongoose");
const { Sizes } = require("../constants/enums");

const cartItemSchema = new mongoose.Schema(
    {
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        productName: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        size: {
            type: String,
            required: true,
            enum: Sizes
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"]
        },
        unitPrice: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        }
    },
    {
        _id: false
    }
);

const cartSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: {
            type: [cartItemSchema],
            default: []
        },
        totalPrice: {
            type: Number,
            default: 0,
            min: [0, "Total price cannot be negative"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Cart", cartSchema);