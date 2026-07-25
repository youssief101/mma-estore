// @youssef: implementing a giftCrad model to handle gifts

const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Gift card code is required"],
            unique: true,
            trim: true,
            uppercase: true,
            minlength: [6, "Gift card code must be at least 6 characters"],
            maxlength: [30, "Gift card code cannot exceed 30 characters"]
        },
        amount: {
            type: Number,
            required: [true, "Gift card amount is required"],
            min: [0, "Gift card amount cannot be negative"]
        },
        isActive: {
            type: Boolean,
            default: true
        },
        expirationDate: {
            type: Date,
            required: [true, "Expiration date is required"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


giftCardSchema.index({ isActive: 1 });
giftCardSchema.index({ expirationDate: 1 });

module.exports = mongoose.model("GiftCard", giftCardSchema);