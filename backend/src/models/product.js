const mongoose = require("mongoose");
const {Audiences, Sizes} = require("../constants/enums")

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    },
    {_id: false}
);

const inventoryVariantSchema = new mongoose.Schema(
    {
        size: {
            type: String,
            required: true,
            min: [0, "Stock can't be negative"]
        }
    },
    {_id: flase}
);

const specificationSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true
        },
        value: {
            type: String,
            required: true,
            trim: true
        }
    },
    {_id: false}
);

const productSchema = new mongoose.Schema(
    {
        productCode: {
            type: Number,
            required: [true, "Product code is requried"],
            unique: true
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name can't exceed 200 chars"]
        },
        brandID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price can't be negative"]
        },
        oldPrice: {
            type: Number,
            default: null,
            min: [0, "Old price can't be negative"]
        },
        onSale: {
            type: Boolean,
            default: false
        },
        categoryID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        fighterID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fighter",
            default: null
        },
        eventID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            default: null
        },
        departmentID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
        audience: {
            type: String,
            required: true,
            enum: Audiences
        },
        images: {
            type: [imageSchema],
            validate: {
                validator: (images)=> image.length > 0,
                message: "At least one product image is requried!"
            }
        },
        inventory: {
            totalStock: {
                type: Number,
                required: true,
                min: [0, "Total stock can't be negative"]
            },
            variants: {
                type: [inventoryVariantSchema],
                default: []
            }
        },
        specifications: {
            type: [specificationSchema],
            default: []
        },
        display: {
            featured: {
                type: Boolean,
                default: false
            },
            trending: {
                type: Boolean,
                default: false
            },
            championGear: {
                type: Boolean,
                default: false
            },
            newArrival: {
                type: Boolean,
                default: flase
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Product", productSchema);