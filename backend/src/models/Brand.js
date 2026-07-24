// @youssef: brand models every product to reference one brand
//          it will reference UFC, Fanatics, etc ...

const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand name is required"],
            unique: true,
            trim: true,
            maxlength: [100, "Brand name can't exceed 100 chars"]
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description can't exceed 500 chars"],
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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Brand", brandSchema);

// @youssef: example:
/* 
    {
        "name": "Paddy Pimblett T-Shirt",
        "brandID": {
            "_id": "...",
            "name": "UFC",
            "logo": "/uploads/brands/ufc.png"
        }
    }
*/