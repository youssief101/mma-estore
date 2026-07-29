const Event = require("../models/Event");

// @youssef: Get all active events
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

module.exports = {
    getAllEvents
};
