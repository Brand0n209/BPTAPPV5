import { google, calendar_v3 } from 'googleapis';
import { config } from '../config';
import { CalendarEvent, CalendarEventResponse, CalendarId } from '../types/calendar';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { GoogleAuth } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
  private auth: GoogleAuth;
  private calendar: calendar_v3.Calendar | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Create the auth client, but don't initialize calendar yet
    this.auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar']
      // Using ADC (Application Default Credentials) via Workload Identity
      // This works both in Cloud Run (via Workload Identity) and
      // locally via ~/.config/gcloud/application_default_credentials.json
    });
    
    // Initialize immediately when service is created
    this.initPromise = this.initialize();
  }
  
  /**
   * Initialize the Google Calendar client
   * This ensures we have a proper authenticated client before making API calls
   */
  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      logger.info('Initializing Google Calendar client');
      
      // Get authenticated client
      const authClient = await this.auth.getClient() as OAuth2Client;
      
      // Create calendar client with the authenticated client
      this.calendar = google.calendar({
        version: 'v3',
        auth: authClient as any
      });
      
      // Get identity information for logging
      const projectId = await this.auth.getProjectId();
      
      // Only attempt to get token info if we have an access token
      let identityEmail = 'Unknown';
      try {
        if (authClient.credentials && authClient.credentials.access_token) {
          const tokenInfo = await authClient.getTokenInfo(
            authClient.credentials.access_token
          );
          identityEmail = tokenInfo.email || 'Unknown';
        }
      } catch (error) {
        logger.warn('Unable to retrieve token information:', error);
      }
      
      // Log detailed authentication information
      logger.info(`Google Calendar client initialized successfully:
  • Environment: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
  • Project ID: ${projectId}
  • Using credentials for: ${identityEmail}
  • Credential source: ${process.env.GOOGLE_APPLICATION_CREDENTIALS ? 
      'Explicit credentials file' : 
      'ADC (Application Default Credentials)'}`);
      
      this.initialized = true;
    } catch (error: any) {
      logger.error('Failed to initialize Google Calendar client:', error);
      throw new AppError(`Failed to initialize Google Calendar client: ${error.message}`, 500);
    }
  }
  
  /**
   * Ensure the calendar client is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
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
  public getCalendarId(calendarKey: CalendarId): string {
    if (!config.calendar[calendarKey]) {
      logger.error(`Calendar not found: ${calendarKey}`);
      throw new AppError(`Calendar "${calendarKey}" not found in configuration`, 404);
    }
    return config.calendar[calendarKey];
  }
  
  /**
   * List events from a calendar
   * @param calendarKey - Key of the calendar in config
   * @param options - Optional parameters (timeMin, timeMax, maxResults)
   * @returns List of calendar events
   */
  public async listEvents(
    calendarKey: CalendarId,
    options: {
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
    } = {}
  ): Promise<CalendarEventResponse[]> {
    // Ensure calendar client is initialized
    await this.ensureInitialized();
    
    try {
      const calendarId = this.getCalendarId(calendarKey);
      
      if (!this.calendar) {
        throw new AppError('Google Calendar client not initialized', 500);
      }
      
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: options.timeMin || new Date().toISOString(),
        timeMax: options.timeMax,
        maxResults: options.maxResults || 100,
        singleEvents: true,
        orderBy: 'startTime',
      });
      
      return response.data.items as CalendarEventResponse[];
    } catch (error: any) {
      logger.error('Google Calendar API error - listEvents:', error);
      if (error.response) {
        // Log detailed API error information
        logger.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
        logger.error('Response data:', error.response.data);
      }
      throw new AppError(`Error fetching calendar events: ${error.message}`, 500);
    }
  }
  
  /**
   * Create a new event in a calendar
   * @param calendarKey - Key of the calendar in config
   * @param eventData - Event data to create
   * @returns Created event data
   */
  public async createEvent(
    calendarKey: CalendarId,
    eventData: CalendarEvent
  ): Promise<CalendarEventResponse> {
    // Ensure calendar client is initialized
    await this.ensureInitialized();
    
    try {
      const calendarId = this.getCalendarId(calendarKey);
      
      if (!this.calendar) {
        throw new AppError('Google Calendar client not initialized', 500);
      }
      
      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: eventData,
      });
      
      return response.data as CalendarEventResponse;
    } catch (error: any) {
      logger.error('Google Calendar API error - createEvent:', error);
      if (error.response) {
        logger.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
        logger.error('Response data:', error.response.data);
      }
      throw new AppError(`Error creating calendar event: ${error.message}`, 500);
    }
  }
  
  /**
   * Delete an event from a calendar
   * @param calendarKey - Key of the calendar in config
   * @param eventId - ID of the event to delete
   * @returns Success status
   */
  public async deleteEvent(
    calendarKey: CalendarId,
    eventId: string
  ): Promise<boolean> {
    // Ensure calendar client is initialized
    await this.ensureInitialized();
    
    try {
      const calendarId = this.getCalendarId(calendarKey);
      
      if (!this.calendar) {
        throw new AppError('Google Calendar client not initialized', 500);
      }
      
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
      
      return true;
    } catch (error: any) {
      logger.error('Google Calendar API error - deleteEvent:', error);
      if (error.response) {
        logger.error(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
        logger.error('Response data:', error.response.data);
      }
      
      // Handle case where event doesn't exist
      if (error.response && error.response.status === 404) {
        throw new AppError(`Event with ID ${eventId} not found`, 404);
      }
      
      throw new AppError(`Error deleting calendar event: ${error.message}`, 500);
    }
  }
  
  /**
   * Test the Google Calendar authentication and connection
   * @returns Authentication information and connection status
   */
  public async testAuth(): Promise<{
    connected: boolean;
    projectId: string;
    identity: string;
    tokenExpiry?: string;
    environment: string;
    credentialSource: string;
    timestamp: string;
  }> {
    await this.ensureInitialized();
    
    try {
      // Get authenticated client
      const authClient = await this.auth.getClient() as OAuth2Client;
      const projectId = await this.auth.getProjectId();
      
      // Get more detailed information about the current credentials
      let identity = 'Unknown';
      let tokenExpiry: string | undefined;
      try {
        if (authClient.credentials && authClient.credentials.access_token) {
          const tokenInfo = await authClient.getTokenInfo(
            authClient.credentials.access_token
          );
          identity = tokenInfo.email || 'Unknown';
          
          // Include token expiry if available
          if (tokenInfo.expiry_date) {
            tokenExpiry = new Date(tokenInfo.expiry_date).toISOString();
          }
        }
      } catch (error) {
        logger.warn('Unable to retrieve token information in testAuth:', error);
      }
      
      // Test API connectivity by calling a lightweight API method
      if (this.calendar) {
        try {
          // Try to access primary calendar to test connectivity
          await this.calendar.calendarList.get({ calendarId: 'primary' });
        } catch (error: any) {
          // Log the error but don't fail - we'll report the connectivity status
          logger.warn('Error testing calendar API access:', error);
          if (error.response) {
            logger.warn(`Status: ${error.response.status}, Message: ${error.response.statusText}`);
          }
          
          return {
            connected: false,
            projectId,
            identity,
            tokenExpiry,
            environment: process.env.NODE_ENV || 'development',
            credentialSource: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 
              'Explicit credentials file' : 
              'ADC (Application Default Credentials)',
            timestamp: new Date().toISOString()
          };
        }
      }
      
      return {
        connected: true,
        projectId,
        identity,
        tokenExpiry,
        environment: process.env.NODE_ENV || 'development',
        credentialSource: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 
          'Explicit credentials file' : 
          'ADC (Application Default Credentials)',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      logger.error('Google Calendar API error - testAuth:', error);
      throw new AppError(`Error testing calendar authentication: ${error.message}`, 500);
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
