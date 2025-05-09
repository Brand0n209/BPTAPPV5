"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendarController_1 = require("../controllers/calendarController");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/calendar/:id/events
 * @desc    Get events from a specific calendar
 * @access  Public (for now)
 */
router.get('/:id/events', calendarController_1.calendarController.getEvents);
/**
 * @route   POST /api/calendar/:id/event
 * @desc    Create a new event in a specific calendar
 * @access  Public (for now)
 */
router.post('/:id/event', calendarController_1.calendarController.createEvent);
/**
 * @route   DELETE /api/calendar/:id/event/:eventId
 * @desc    Delete an event from a specific calendar
 * @access  Public (for now)
 */
router.delete('/:id/event/:eventId', calendarController_1.calendarController.deleteEvent);
exports.default = router;
//# sourceMappingURL=calendar.js.map