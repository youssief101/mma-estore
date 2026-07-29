const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

router.get("/", getAllEvents);
router.get("/:eventId", getEventById);
router.post("/", authenticate, authorize("Admin"), createEvent);
router.put("/:eventId", authenticate, authorize("Admin"), updateEvent);
router.delete("/:eventId", authenticate, authorize("Admin"), deleteEvent);

module.exports = router;
