const mongoose = require("mongoose");

const {
    Sizes,
    PaymentMethods,
    PaymentStatuses,
    OrderStatuses
} = require("../constants/enums");

const shippingAddressSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },

        lastName: { type: String, required: true, trim: true },

        phone: { type: String, required: true },

        country: { type: String, required: true },

        city: { type: String, required: true },

        street: { type: String, required: true },

        building: { type: String, default: "" },

        apartment: { type: String, default: "" },

        postalCode: { type: String, default: "" }
    },
    { _id: false }
);

const orderItemSchema = new mongoose.Schema(
    {
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        size: {
            type: String,
            enum: Sizes,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: Number,
            unique: true,
            required: true
        },

        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true
        },

        items: {
            type: [orderItemSchema],
            validate: {
                validator: items => items.length > 0,
                message: "Order must contain at least one item."
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        shipping: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        payment: {
            method: {
                type: String,
                enum: PaymentMethods,
                required: true
            },

            status: {
                type: String,
                enum: PaymentStatuses,
                default: "Pending"
            },

            paidAt: {
                type: Date,
                default: null
            }
        },

        orderStatus: {
            type: String,
            enum: OrderStatuses,
            default: "Pending"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// orderNumber already indexed by unique:true

orderSchema.index({ userID: 1 });

orderSchema.index({ orderStatus: 1 });

orderSchema.index({ "payment.status": 1 });

orderSchema.index({ createdAt: -1 });
module.exports = mongoose.model("Order", orderSchema);
