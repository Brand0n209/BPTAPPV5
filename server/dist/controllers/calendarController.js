"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarController = void 0;
const googleCalendarService_1 = require("../services/googleCalendarService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.calendarController = {
    /**
     * Get events from a calendar
     */
    getEvents: async (req, res, next) => {
        try {
            const calendarKey = req.params.id;
            const { timeMin, timeMax, maxResults } = req.query;
            const events = await googleCalendarService_1.googleCalendarService.listEvents(calendarKey, {
                timeMin: timeMin,
                timeMax: timeMax,
                maxResults: maxResults ? parseInt(maxResults) : undefined,
            });
            res.status(200).json({
                status: 'success',
                results: events.length,
                data: events,
            });
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Create a new event in a calendar
     */
    createEvent: async (req, res, next) => {
        try {
            const calendarKey = req.params.id;
            const eventData = req.body;
            // Validate required fields
            if (!eventData.summary) {
                throw new errorHandler_1.AppError('Event summary is required', 400);
            }
            if (!eventData.start?.dateTime || !eventData.end?.dateTime) {
                throw new errorHandler_1.AppError('Event start and end dates are required', 400);
            }
            const newEvent = await googleCalendarService_1.googleCalendarService.createEvent(calendarKey, eventData);
            res.status(201).json({
                status: 'success',
                data: newEvent,
            });
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * Delete an event from a calendar
     */
    deleteEvent: async (req, res, next) => {
        try {
            const calendarKey = req.params.id;
            const eventId = req.params.eventId;
            if (!eventId) {
                throw new errorHandler_1.AppError('Event ID is required', 400);
            }
            await googleCalendarService_1.googleCalendarService.deleteEvent(calendarKey, eventId);
            res.status(200).json({
                status: 'success',
                message: `Event ${eventId} has been deleted`,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=calendarController.js.map