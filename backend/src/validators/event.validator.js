const { body, param, query } = require("express-validator");
const { EventTypes } = require("../constants/enums");

// @youssef: Public Validators

const validateGetAllEvents = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100.")

];

const validateGetEventById = [

    param("eventId")
        .isMongoId()
        .withMessage("Invalid event ID.")

];

// @youssef: Admin Validators

const validateCreateEvent = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Event name is required.")
        .isLength({ max: 150 })
        .withMessage("Event name cannot exceed 150 characters."),

    body("eventDate")
        .notEmpty()
        .withMessage("Event date is required.")
        .isISO8601()
        .withMessage("Event date must be a valid date."),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required.")
        .isLength({ max: 150 })
        .withMessage("Location cannot exceed 150 characters."),

    body("image")
        .trim()
        .notEmpty()
        .withMessage("Image is required."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters."),

    body("eventType")
        .notEmpty()
        .withMessage("Event type is required.")
        .isIn(EventTypes)
        .withMessage("Invalid event type.")

];

const validateUpdateEvent = [

    param("eventId")
        .isMongoId()
        .withMessage("Invalid event ID."),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Event name cannot be empty.")
        .isLength({ max: 150 })
        .withMessage("Event name cannot exceed 150 characters."),

    body("eventDate")
        .optional()
        .isISO8601()
        .withMessage("Event date must be a valid date."),

    body("location")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Location cannot be empty.")
        .isLength({ max: 150 })
        .withMessage("Location cannot exceed 150 characters."),

    body("image")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Image cannot be empty."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters."),

    body("eventType")
        .optional()
        .isIn(EventTypes)
        .withMessage("Invalid event type."),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean.")

];

const validateDeleteEvent = [

    param("eventId")
        .isMongoId()
        .withMessage("Invalid event ID.")

];

module.exports = {
    validateGetAllEvents,
    validateGetEventById,
    validateCreateEvent,
    validateUpdateEvent,
    validateDeleteEvent
};