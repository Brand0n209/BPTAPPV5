/**
 * Calendar API Diagnostic Utility
 * 
 * This file provides diagnostic functions to help troubleshoot Google Calendar integration issues.
 * Run these functions from the browser console to diagnose connectivity problems.
 */
import axios from 'axios';

// Constants with all possible endpoints to test
const ENDPOINTS = {
  // Backend health check (doesn't require Google auth)
  serverHealth: '/api/health',
  
  // Calendar API endpoints
  calAuthTest: '/api/calendar/auth/test',
  brightProdigyEvents: '/api/calendar/brightProdigy/events',
  greetingsEvents: '/api/calendar/greetings/events',
  crew1Events: '/api/calendar/crew1/events',
  pendingEvents: '/api/calendar/pending/events'
};

/**
 * Test connectivity to a single endpoint
 * @param {string} url - Full URL to test
 * @param {Object} options - Axios request options
 * @returns {Promise<Object>} Result with status and response data
 */
const testEndpoint = async (url, options = {}) => {
  console.log(`Testing endpoint: ${url}`);
  try {
    const start = Date.now();
    const response = await axios({
      url,
      method: 'GET',
      timeout: 10000,
      withCredentials: true,
      ...options
    });
    const elapsed = Date.now() - start;
    
    return {
      url,
      success: true,
      status: response.status,
      statusText: response.statusText,
      dataPreview: truncateData(response.data),
      timeMs: elapsed,
      error: null
    };
  } catch (error) {
    return {
      url,
      success: false,
      status: error.response?.status,
      statusText: error.response?.statusText,
      dataPreview: error.response?.data ? truncateData(error.response.data) : null,
      timeMs: null,
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack,
        type: error.name
      }
    };
  }
};

/**
 * Truncate large objects for display
 */
const truncateData = (data) => {
  const str = JSON.stringify(data);
  return str.length > 200 ? str.substring(0, 200) + '...' : str;
};

/**
 * Run a full diagnostic test of all endpoints
 * @param {string} baseUrl - Base URL to test (e.g., http://localhost:8080)
 */
export const runFullDiagnostic = async (baseUrl = 'http://localhost:8080') => {
  console.log('%c📊 Starting Calendar API Diagnostic', 'font-size: 16px; font-weight: bold; color: blue;');
  console.log(`Base URL: ${baseUrl}`);
  
  const results = {};
  
  // Test each endpoint
  for (const [name, path] of Object.entries(ENDPOINTS)) {
    const url = `${baseUrl}${path}`;
    results[name] = await testEndpoint(url);
  }
  
  // Log summary
  console.log('%c📋 Diagnostic Results Summary', 'font-size: 16px; font-weight: bold; color: blue;');
  console.table(Object.entries(results).map(([name, result]) => ({
    Endpoint: name,
    URL: result.url,
    Status: `${result.status || 'N/A'} ${result.statusText || ''}`,
    Success: result.success ? '✅' : '❌',
    Time: result.timeMs ? `${result.timeMs}ms` : 'N/A',
    Error: result.error?.message || 'None'
  })));
  
  // Detailed results
  console.log('%c🔍 Detailed Diagnostic Results', 'font-size: 16px; font-weight: bold; color: blue;');
  console.log(results);
  
  // Analysis
  console.log('%c🧪 Analysis', 'font-size: 16px; font-weight: bold; color: blue;');
  
  if (results.serverHealth?.success) {
    console.log('✅ Server is healthy and reachable');
  } else {
    console.log('❌ Server health check failed - the server might be down or unreachable');
  }
  
  if (results.calAuthTest?.success) {
    console.log('✅ Google Calendar authentication is working');
  } else {
    console.log('❌ Google Calendar authentication failed - check credentials and permissions');
  }
  
  const calendarEndpoints = ['brightProdigyEvents', 'greetingsEvents', 'crew1Events', 'pendingEvents'];
  const workingCalendars = calendarEndpoints.filter(cal => results[cal]?.success);
  
  if (workingCalendars.length === calendarEndpoints.length) {
    console.log('✅ All calendar endpoints are working');
  } else if (workingCalendars.length > 0) {
    console.log(`⚠️ Some calendar endpoints are working (${workingCalendars.length}/${calendarEndpoints.length})`);
    console.log('Working calendars:', workingCalendars.join(', '));
    console.log('Failed calendars:', calendarEndpoints.filter(cal => !results[cal]?.success).join(', '));
  } else {
    console.log('❌ No calendar endpoints are working');
  }
  
  // CORS check
  const corsIssues = Object.values(results).some(r => 
    r.error?.message?.includes('CORS') || 
    r.error?.code === 'ERR_NETWORK'
  );
  
  if (corsIssues) {
    console.log('❌ Possible CORS issues detected. Check that server CORS configuration includes:');
    console.log(`   origin: '${window.location.origin}'`);
    console.log('   credentials: true');
  }
  
  return results;
};

/**
 * Run a quick test of just the calendar API authentication
 */
export const testCalendarAuth = async (baseUrl = 'http://localhost:8080') => {
  return await testEndpoint(`${baseUrl}/api/calendar/auth/test`);
};

/**
 * Test a specific calendar's events
 */
export const testCalendarEvents = async (calendarId, baseUrl = 'http://localhost:8080') => {
  return await testEndpoint(`${baseUrl}/api/calendar/${calendarId}/events`);
};

/**
 * Add to global window for console access
 */
if (typeof window !== 'undefined') {
  window.calendarDiagnostic = {
    runFullDiagnostic,
    testCalendarAuth,
    testCalendarEvents,
    testEndpoint
  };
  console.log('%c📝 Calendar Diagnostic Tool loaded', 'color: green; font-weight: bold');
  console.log('Run window.calendarDiagnostic.runFullDiagnostic() in console to test API connectivity');
}

export default {
  runFullDiagnostic,
  testCalendarAuth,
  testCalendarEvents
};
