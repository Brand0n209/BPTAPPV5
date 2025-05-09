import { Router } from 'express';
import { calendarController } from '../controllers/calendarController';

const router = Router();

/**
 * @route   GET /api/calendar/:id/events
 * @desc    Get events from a specific calendar
 * @access  Public (for now)
 */
router.get('/:id/events', calendarController.getEvents);

/**
 * @route   POST /api/calendar/:id/event
 * @desc    Create a new event in a specific calendar
 * @access  Public (for now)
 */
router.post('/:id/event', calendarController.createEvent);

/**
 * @route   DELETE /api/calendar/:id/event/:eventId
 * @desc    Delete an event from a specific calendar
 * @access  Public (for now)
 */
router.delete('/:id/event/:eventId', calendarController.deleteEvent);

/**
 * @route   GET /api/calendar/auth/test
 * @desc    Test Google Calendar authentication and connectivity
 * @access  Public (for now)
 */
router.get('/auth/test', calendarController.testAuth);

export default router;
