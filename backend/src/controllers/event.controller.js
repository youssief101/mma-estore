const Event = require("../models/Event");

// @Nassar: Get all active events
const getAllEvents = async (req, res) => {
    try {

        const events = await Event.find({
            isActive: true
        }).sort({
            eventDate: 1,
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
// @Nassar: Get event by ID
const getEventById = async (req, res) => {
    try {

        const { eventId } = req.params;

        const event = await Event.findOne({
            _id: eventId,
            isActive: true
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        return res.status(200).json({
            success: true,
            event
        });

    } catch (error) {

        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
// @Nassar: Create event
const createEvent = async (req, res) => {
    try {

        const {
            name,
            eventDate,
            location,
            image,
            description,
            eventType
        } = req.body;

        if (
            !name ||
            !eventDate ||
            !location ||
            !image ||
            !eventType
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, event date, location, image and event type are required."
            });
        }

        const trimmedName = name.trim();

        const existingEvent = await Event.findOne({
            name: {
                $regex: new RegExp(`^${trimmedName}$`, "i")
            }
        });

        if (existingEvent) {
            return res.status(409).json({
                success: false,
                message: "Event already exists."
            });
        }

        const event = await Event.create({
            name: trimmedName,
            eventDate,
            location: location.trim(),
            image: image.trim(),
            description: description?.trim() || "",
            eventType
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully.",
            event
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
module.exports = {
    getAllEvents,
    getEventById,
    createEvent
};
