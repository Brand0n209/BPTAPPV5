import React, { useState, useEffect } from 'react';
// Import diagnostic tool - can be removed after debugging is complete
import '../services/calendarDiagnostic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import calendarService from '../services/calendarService';

function SchedulerManage() {
  const [calendarFilter, setCalendarFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calendars, setCalendars] = useState([]);
  
  // Load events from the selected calendar(s)
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let allEvents = [];
      
      if (calendarFilter === 'all') {
        // Load events from all calendars
        const calendarIds = ['brightProdigy', 'crew1', 'pending'];
        
        for (const calendarId of calendarIds) {
          const calendarEvents = await calendarService.getEvents(calendarId);
          
          // Add calendar identifier to each event
          const eventsWithCalendar = calendarEvents.map(event => ({
            ...event,
            calendarId
          }));
          
          allEvents = [...allEvents, ...eventsWithCalendar];
        }
      } else {
        // Load events from the selected calendar
        const calendarEvents = await calendarService.getEvents(calendarFilter);
        allEvents = calendarEvents.map(event => ({
          ...event,
          calendarId: calendarFilter
        }));
      }
      
      setEvents(allEvents);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
      setAlert({
        open: true,
        message: 'Failed to load events: ' + (err.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load events when calendar filter changes
  useEffect(() => {
    loadEvents();
    // Log React environment for debugging
    console.log('React environment variables:', {
      apiUrl: process.env.REACT_APP_API_URL,
      nodeEnv: process.env.NODE_ENV,
      envMode: process.env.REACT_APP_ENV
    });
  }, [calendarFilter]);
  
  // Initialize calendars
  useEffect(() => {
    setCalendars(calendarService.getCalendarOptions());
  }, []);
  
  // Map events to FullCalendar format
  const calendarEvents = events.map(evt => ({
    id: evt.id,
    title: evt.summary,
    start: evt.start?.dateTime || evt.start?.date,
    end: evt.end?.dateTime || evt.end?.date,
    extendedProps: {
      calendar: calendarService.calendarNames[evt.calendarId] || evt.calendarId,
      calendarId: evt.calendarId,
      description: evt.description || '',
      location: evt.location || '',
      attendees: evt.attendees || []
    }
  }));
  
  // Handlers
  const handleFilterChange = (e) => {
    setCalendarFilter(e.target.value);
    console.log('Calendar filter changed to:', e.target.value);
  };
  
  // Debug function accessible from UI - can be removed when everything works
  const runDiagnostic = () => {
    if (window.calendarDiagnostic) {
      window.calendarDiagnostic.runFullDiagnostic();
      setAlert({
        open: true,
        message: 'Running diagnostic - check browser console for results',
        severity: 'info'
      });
    }
  };
  
  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      ...info.event.extendedProps
    });
    setEditDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };
  
  const handleEventEdit = () => {
    // In a real implementation, you would call the API to update the event
    setAlert({ open: true, message: 'Event editing is not implemented yet.', severity: 'info' });
    setEditDialogOpen(false);
  };
  
  const handleEventDelete = async () => {
    if (!selectedEvent || !selectedEvent.id || !selectedEvent.calendarId) {
      setAlert({ open: true, message: 'Cannot delete event: Missing event data', severity: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      await calendarService.deleteEvent(selectedEvent.calendarId, selectedEvent.id);
      
      setAlert({ open: true, message: 'Event deleted successfully!', severity: 'success' });
      setEditDialogOpen(false);
      
      // Reload events
      loadEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setAlert({
        open: true,
        message: 'Failed to delete event: ' + (err.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format attendees for display
  const formatAttendees = (attendees) => {
    if (!attendees || !attendees.length) return 'None';
    return attendees.map(a => a.email || a.displayName || 'Unknown').join(', ');
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: '48px' }}>
      <Box
        sx={{
          mb: 2,
          background: '#fff',
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Select
          value={calendarFilter}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 180 }}
          disabled={loading}
        >
          {calendars.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
        
        <Button 
          onClick={loadEvents} 
          variant="outlined" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Refresh'}
        </Button>
        
        <Button 
          onClick={runDiagnostic}
          variant="outlined" 
          color="secondary"
        >
          Run Diagnostic
        </Button>
        
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          background: '#fff',
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
          fontFamily: `'Inter', 'Segoe UI', Arial, sans-serif`,
          position: 'relative'
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height={650}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'true'
          }}
        />
      </Box>
      
      {/* Event Details Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <TextField
                label="Title"
                value={selectedEvent.title}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Calendar"
                value={selectedEvent.calendar}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Start"
                value={new Date(selectedEvent.start).toLocaleString()}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="End"
                value={new Date(selectedEvent.end).toLocaleString()}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Location"
                value={selectedEvent.location || 'No location specified'}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Description"
                value={selectedEvent.description || 'No description'}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Attendees"
                value={formatAttendees(selectedEvent.attendees)}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEventDelete} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SchedulerManage;
