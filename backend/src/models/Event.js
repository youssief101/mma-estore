// @youssef: the event model represents a real-world UFC event and is
//          referenced by products

const mongoose = require("mongoose");
const { EventTypes } = require("../constants/enums");

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Event name is required"],
            unique: true,
            trim: true,
            maxlength: [150, "Event name cannot exceed 150 characters"]
        },
        eventDate: {
            type: Date,
            required: [true, "Event date is required"]
        },
        location: {
            type: String,
            required: [true, "Event location is required"],
            trim: true,
            maxlength: [150, "Location cannot exceed 150 characters"]
        },
        image: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
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