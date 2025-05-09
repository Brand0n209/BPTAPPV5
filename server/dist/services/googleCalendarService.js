"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCalendarService = exports.GoogleCalendarService = void 0;
const googleapis_1 = require("googleapis");
const config_1 = require("../config");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class GoogleCalendarService {
    constructor() {
        this.calendar = null;
        this.initialized = false;
        this.initPromise = null;
        // Create the auth client, but don't initialize calendar yet
        this.auth = new googleapis_1.google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/calendar']
            // Using ADC (Application Default Credentials) via Workload Identity
        });
        // Initialize immediately when service is created
        this.initPromise = this.initialize();
    }
    /**
     * Initialize the Google Calendar client
     * This ensures we have a proper authenticated client before making API calls
     */
    async initialize() {
        if (this.initialized) {
            return;
        }
        try {
            logger_1.logger.info('Initializing Google Calendar client');
            // Get authenticated client
            const authClient = await this.auth.getClient();
            // Create calendar client with the authenticated client
            this.calendar = googleapis_1.google.calendar({
                version: 'v3',
                auth: authClient
            });
            this.initialized = true;
            logger_1.logger.info('Google Calendar client initialized successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize Google Calendar client:', error);
            throw new errorHandler_1.AppError(`Failed to initialize Google Calendar client: ${error.message}`, 500);
        }
    }
    /**
     * Ensure the calendar client is initialized before use
     */
    async ensureInitialized() {
        if (this.initPromise) {
            await this.initPromise;
        }
        if (!this.initialized || !this.calendar) {
            this.initPromise = this.initialize();
            await this.initPromise;
        }
    }
    /**
     * Get calendar ID from configuration by key
     * @param calendarKey - Key of the calendar in config
     * @returns Calendar ID
     */
    getCalendarId(calendarKey) {
        if (!config_1.config.calendar[calendarKey]) {
            logger_1.logger.error(`Calendar not found: ${calendarKey}`);
            throw new errorHandler_1.AppError(`Calendar "${calendarKey}" not found in configuration`, 404);
        }
        return config_1.config.calendar[calendarKey];
    }
    /**
     * List events from a calendar
     * @param calendarKey - Key of the calendar in config
     * @param options - Optional parameters (timeMin, timeMax, maxResults)
     * @returns List of calendar events
     */
    async listEvents(calendarKey, options = {}) {
        // Ensure calendar client is initialized
        await this.ensureInitialized();
        try {
            const calendarId = this.getCalendarId(calendarKey);
            if (!this.calendar) {
                throw new errorHandler_1.AppError('Google Calendar client not initialized', 500);
            }
            const response = await this.calendar.events.list({
                calendarId,
                timeMin: options.timeMin || new Date().toISOString(),
                timeMax: options.timeMax,
                maxResults: options.maxResults || 100,
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items;
        }
        catch (error) {
            logger_1.logger.error('Google Calendar API error - listEvents:', error);
            if (error.response) {
                // Log detailed API error information
                logger_1.logger.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
                logger_1.logger.error('Response data:', error.response.data);
            }
            throw new errorHandler_1.AppError(`Error fetching calendar events: ${error.message}`, 500);
        }
    }
    /**
     * Create a new event in a calendar
     * @param calendarKey - Key of the calendar in config
     * @param eventData - Event data to create
     * @returns Created event data
     */
    async createEvent(calendarKey, eventData) {
        // Ensure calendar client is initialized
        await this.ensureInitialized();
        try {
            const calendarId = this.getCalendarId(calendarKey);
            if (!this.calendar) {
                throw new errorHandler_1.AppError('Google Calendar client not initialized', 500);
            }
            const response = await this.calendar.events.insert({
                calendarId,
                requestBody: eventData,
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Google Calendar API error - createEvent:', error);
            if (error.response) {
                logger_1.logger.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
                logger_1.logger.error('Response data:', error.response.data);
            }
            throw new errorHandler_1.AppError(`Error creating calendar event: ${error.message}`, 500);
        }
    }
    /**
     * Delete an event from a calendar
     * @param calendarKey - Key of the calendar in config
     * @param eventId - ID of the event to delete
     * @returns Success status
     */
    async deleteEvent(calendarKey, eventId) {
        // Ensure calendar client is initialized
        await this.ensureInitialized();
        try {
            const calendarId = this.getCalendarId(calendarKey);
            if (!this.calendar) {
                throw new errorHandler_1.AppError('Google Calendar client not initialized', 500);
            }
            await this.calendar.events.delete({
                calendarId,
                eventId,
            });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Google Calendar API error - deleteEvent:', error);
            if (error.response) {
                logger_1.logger.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
                logger_1.logger.error('Response data:', error.response.data);
            }
            // Handle case where event doesn't exist
            if (error.response && error.response.status === 404) {
                throw new errorHandler_1.AppError(`Event with ID ${eventId} not found`, 404);
            }
            throw new errorHandler_1.AppError(`Error deleting calendar event: ${error.message}`, 500);
        }
    }
}
exports.GoogleCalendarService = GoogleCalendarService;
exports.googleCalendarService = new GoogleCalendarService();
//# sourceMappingURL=googleCalendarService.js.map