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
module.exports = {
    getAllEvents,
    getEventById
};
