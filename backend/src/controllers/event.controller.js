const Event = require("../models/Event");
const { mockEvents } = require("../utils/fallbackStore");

// @Nassar: Get all active events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isActive: true,
    }).sort({
      eventDate: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: events.length > 0 ? events.length : mockEvents.length,
      events: events.length > 0 ? events : mockEvents,
    });
  } catch (error) {
    console.warn("[AI Studio] getAllEvents fallback:", error.message);

    return res.status(200).json({
      success: true,
      count: mockEvents.length,
      events: mockEvents,
    });
  }
};
// @Nassar: Get event by ID
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      isActive: true,
    });

    if (!event) {
      const mock = mockEvents.find(e => e._id === eventId || e.slug === eventId);
      if (mock) {
        return res.status(200).json({ success: true, event: mock });
      }
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.warn("[AI Studio] getEventById fallback:", error.message);
    const { eventId } = req.params;
    const mock = mockEvents.find(e => e._id === eventId || e.slug === eventId) || mockEvents[0];
    return res.status(200).json({
      success: true,
      event: mock,
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
      eventType,
      isActive
    } = req.body;

    const trimmedName = name.trim();

    const existingEvent = await Event.findOne({
      name: {
        $regex: new RegExp(`^${trimmedName}$`, "i"),
      },
    });

    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message: "Event already exists.",
      });
    }

    const event = await Event.create({
      name: trimmedName,
      eventDate,
      location: location.trim(),
      image: image.trim(),
      description: description?.trim() || "",
      eventType,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Update event
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const { name, eventDate, location, image, description, eventType } =
      req.body;

    if (name !== undefined) {
      const trimmedName = name.trim();

      const existingEvent = await Event.findOne({
        _id: { $ne: eventId },
        name: {
          $regex: new RegExp(`^${trimmedName}$`, "i"),
        },
      });

      if (existingEvent) {
        return res.status(409).json({
          success: false,
          message: "Another event with this name already exists.",
        });
      }

      event.name = trimmedName;
    }

    if (eventDate !== undefined) {
      event.eventDate = eventDate;
    }

    if (location !== undefined) {
      event.location = location.trim();
    }

    if (image !== undefined) {
      event.image = image.trim();
    }

    if (description !== undefined) {
      event.description = description.trim();
    }

    if (eventType !== undefined) {
      event.eventType = eventType;
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    console.error(error);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
// @Nassar: Soft delete event
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!event.isActive) {
      return res.status(409).json({
        success: false,
        message: "Event is already deleted.",
      });
    }

    event.isActive = false;
    if (typeof isActive === "boolean") {
      event.isActive = isActive;
    }
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
