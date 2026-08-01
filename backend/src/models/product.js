const mongoose = require("mongoose");
const { Audiences, Sizes } = require("../constants/enums");

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
    { _id: false }
);

const inventoryVariantSchema = new mongoose.Schema(
    {
        size: {
            type: String,
            required: true,
            enum: Sizes
        },
        stock: {
            type: Number,
            required: true,
            min: [0, "Stock cannot be negative"]
        }
    },
    { _id: false }
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
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        productCode: {
            type: Number,
            required: [true, "Product code is required"],
            unique: true
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name cannot exceed 200 characters"]
        },
        brandID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: [5000, "Description cannot exceed 5000 characters"]
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },
        oldPrice: {
            type: Number,
            default: null,
            min: [0, "Old price cannot be negative"]
        },
        discountPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
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
                validator: (images) => images.length > 0,
                message: "At least one product image is required."
            }
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        inventory: {
            totalStock: {
                type: Number,
                required: true,
                min: [0, "Total stock cannot be negative"]
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
                default: false
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// indexing multiple search hits for optimizing performance

productSchema.index({ name: "text" });
productSchema.index({ brandID: 1 });
productSchema.index({ categoryID: 1 });
productSchema.index({ departmentID: 1 });
productSchema.index({ fighterID: 1 });
productSchema.index({ eventID: 1 });
productSchema.index({ audience: 1 });
productSchema.index({ onSale: 1 });
productSchema.index({
    name: "text",
    description: "text"
});

productSchema.index({ "display.featured": 1 });
productSchema.index({ "display.trending": 1 });
productSchema.index({ "display.championGear": 1 });
productSchema.index({ "display.newArrival": 1 });

// Frequently used compound filter
productSchema.index({
    categoryID: 1,
    audience: 1,
    onSale: 1
});

module.exports = mongoose.model("Product", productSchema);