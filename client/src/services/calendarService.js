import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Log the API base URL for debugging
console.log('Calendar Service using API base URL: /');

/**
 * Calendar service to handle all API calls related to Google Calendar
 */
const calendarService = {
  /**
   * Fetch events from a specific calendar
   * 
   * @param {string} calendarId - The calendar ID (greetings, brightProdigy, crew1, pending)
   * @param {Object} options - Optional query parameters
   * @param {string} options.timeMin - Start date (ISO string)
   * @param {string} options.timeMax - End date (ISO string)
   * @param {number} options.maxResults - Maximum number of events to return
   * @returns {Promise<Array>} - Promise resolving to array of events
   */
  getEvents: async (calendarId, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.timeMin) params.append('timeMin', options.timeMin);
      if (options.timeMax) params.append('timeMax', options.timeMax);
      if (options.maxResults) params.append('maxResults', options.maxResults);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/calendar/${calendarId}/events${queryString}`);

      console.log('Calendar API response:', response);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },
  
  /**
   * Create a new event in a specific calendar
   * 
   * @param {string} calendarId - The calendar ID (greetings, brightProdigy, crew1, pending)
   * @param {Object} eventData - The event data
   * @returns {Promise<Object>} - Promise resolving to the created event
   */
  createEvent: async (calendarId, eventData) => {
    try {
      const response = await api.post(`/calendar/${calendarId}/event`, eventData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },
  
  /**
   * Delete an event from a specific calendar
   * 
   * @param {string} calendarId - The calendar ID (greetings, brightProdigy, crew1, pending)
   * @param {string} eventId - The ID of the event to delete
   * @returns {Promise<Object>} - Promise resolving to success response
   */
  deleteEvent: async (calendarId, eventId) => {
    try {
      const response = await api.delete(`/calendar/${calendarId}/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  },

  /**
   * Map calendar keys to human-readable names
   */
  calendarNames: {
    brightProdigy: 'Bright Prodigy',
    crew1: 'Crew 1',
    pending: 'Pending'
  },

  /**
   * Get list of available calendars
   * 
   * @returns {Array} - Array of calendar options
   */
  getCalendarOptions: () => {
    return [
      { value: 'all', label: 'All Calendars' },
      { value: 'brightProdigy', label: 'Bright Prodigy' },
      { value: 'crew1', label: 'Crew 1' },
      { value: 'pending', label: 'Pending' }
    ];
  }
};

export default calendarService;
