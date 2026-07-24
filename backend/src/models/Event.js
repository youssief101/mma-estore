// @youssef: the event model represents a real-world UFC event and is
//          referenced by products

const mongoose = require("mongoose");
const {EventTypes} = require("../constants/enums");

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Event name is required"],
            unique: true,
            trim: true,
            maxlength: [150, "Event name can't exceed 150 chars"]
        },
        eventDate: {
            type: Date,
            required: [true, "Event data is required"]
        },
        image: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description can't exceed 1000 chars"],
            default: ""
        },
        eventType: {
            type: String,
            required: true,
            enum: EventTypes
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Event", eventSchema);

// @youssef: example:
/* 
    {
        "_id": "...",
        "name": "UFC 313",
        "eventDate": "2026-03-08T00:00:00.000Z",
        "location": "Las Vegas, Nevada",
        "image": "/uploads/events/ufc313.jpg",
        "description": "Official UFC 313 merchandise.",
        "eventType": "PPV",
        "createdAt": "...",
        "updatedAt": "..."
    }
*/