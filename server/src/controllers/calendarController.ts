import { Request, Response, NextFunction } from 'express';
import { googleCalendarService } from '../services/googleCalendarService';
import { CalendarEvent, CalendarId } from '../types/calendar';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const calendarController = {
  /**
   * Get events from a calendar
   */
  getEvents: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const calendarKey = req.params.id as CalendarId;
      const { timeMin, timeMax, maxResults } = req.query;
      
      const events = await googleCalendarService.listEvents(calendarKey, {
        timeMin: timeMin as string,
        timeMax: timeMax as string,
        maxResults: maxResults ? parseInt(maxResults as string) : undefined,
      });
      
      res.status(200).json({
        status: 'success',
        results: events.length,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Create a new event in a calendar
   */
  createEvent: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const calendarKey = req.params.id as CalendarId;
      const eventData = req.body as CalendarEvent;
      
      // Validate required fields
      if (!eventData.summary) {
        throw new AppError('Event summary is required', 400);
      }
      
      if (!eventData.start?.dateTime || !eventData.end?.dateTime) {
        throw new AppError('Event start and end dates are required', 400);
      }
      
      const newEvent = await googleCalendarService.createEvent(calendarKey, eventData);
      
      res.status(201).json({
        status: 'success',
        data: newEvent,
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Delete an event from a calendar
   */
  deleteEvent: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const calendarKey = req.params.id as CalendarId;
      const eventId = req.params.eventId;
      
      if (!eventId) {
        throw new AppError('Event ID is required', 400);
      }
      
      await googleCalendarService.deleteEvent(calendarKey, eventId);
      
      res.status(200).json({
        status: 'success',
        message: `Event ${eventId} has been deleted`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Test Google Calendar authentication and connectivity
   * This endpoint is useful for verifying credentials are working correctly
   */
  testAuth: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Testing Google Calendar authentication...');
      const authInfo = await googleCalendarService.testAuth();
      
      res.status(200).json({
        status: 'success',
        data: authInfo,
      });
    } catch (error) {
      logger.error('Auth test failed:', error);
      next(error);
    }
  },
};
