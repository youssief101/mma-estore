const express = require("express");

const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validation.middleware");

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/event.controller");

const {
    validateGetAllEvents,
    validateGetEventById,
    validateCreateEvent,
    validateUpdateEvent,
    validateDeleteEvent
} = require("../validators/event.validator");

const router = express.Router();

// Public
router.get(
    "/",
    validateGetAllEvents,
    validate,
    getAllEvents
);

router.get(
    "/:eventId",
    validateGetEventById,
    validate,
    getEventById
);

// Admin
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    validateCreateEvent,
    validate,
    createEvent
);

router.put(
    "/:eventId",
    authenticate,
    authorize("Admin"),
    validateUpdateEvent,
    validate,
    updateEvent
);

router.delete(
    "/:eventId",
    authenticate,
    authorize("Admin"),
    validateDeleteEvent,
    validate,
    deleteEvent
);

module.exports = router;