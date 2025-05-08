import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function SchedulerManage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calendar/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load events. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleEditEvent = (event) => {
    // Navigate to edit form with event data
    navigate(`/scheduler-create?edit=${event.id}`);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/calendar/events/${selectedEvent.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter(evt => evt.id !== selectedEvent.id));
      setSnackbar({
        open: true,
        message: 'Event deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete event. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const CalendarView = () => (
    <div className="calendar-view">
      <Grid container spacing={2}>
        {/* Date picker */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <Box sx={{ width: '100%' }}>{params.inputProps.value}</Box>}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Event Filters
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ mr: 1, mb: 1 }}
              startIcon={<CalendarTodayIcon />}
            >
              All Events
            </Button>
            <Button 
              variant="outlined" 
              sx={{ mr: 1, mb: 1 }}
              color="primary"
            >
              Installations
            </Button>
            <Button 
              variant="outlined" 
              sx={{ mr: 1, mb: 1 }}
              color="secondary"
            >
              Consultations
            </Button>
            <Button 
              variant="outlined" 
              sx={{ mr: 1, mb: 1 }}
              color="success"
            >
              Maintenance
            </Button>
          </Paper>
        </Grid>
        {/* Calendar grid */}
        <Grid item xs={12} sm={8} md={9}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Events for {formatDate(selectedDate)}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/scheduler-create')}
              >
                New Event
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" p={4}>
                  <CircularProgress />
                </Box>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card sx={{ 
                      bgcolor: event.eventType === 'Installation' 
                        ? '#e3f2fd' 
                        : event.eventType === 'Consultation' 
                          ? '#fce4ec' 
                          : '#e8f5e9'
                    }}>
                      <CardContent>
                        <Typography variant="h6" component="div" noWrap>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          <strong>Customer:</strong> {event.customer?.firstName} {event.customer?.lastName}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          <strong>Location:</strong> {event.location || 'No location set'}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          <strong>Technician:</strong> {event.technician?.name || 'Unassigned'}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditEvent(event)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(event)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box width="100%" p={4} textAlign="center">
                  <Typography variant="body1">No events found for this date</Typography>
                </Box>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  const TableView = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="events table">
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Technician</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : events.length > 0 ? (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Typography variant="body1">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{event.eventType}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatDate(event.startTime)}</Typography>
                  <Typography variant="body2">{formatTime(event.startTime)} - {formatTime(event.endTime)}</Typography>
                </TableCell>
                <TableCell>
                  {event.customer?.firstName} {event.customer?.lastName}
                </TableCell>
                <TableCell>{event.location || 'No location set'}</TableCell>
                <TableCell>{event.technician?.name || 'Unassigned'}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditEvent(event)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Schedule
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/scheduler-create')}
        >
          Create New Event
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={viewMode}
          onChange={handleViewModeChange}
          aria-label="scheduler view mode"
          centered
        >
          <Tab icon={<CalendarTodayIcon />} label="Calendar" value="calendar" />
          <Tab icon={<ViewWeekIcon />} label="Table" value="table" />
        </Tabs>
      </Paper>
      
      {viewMode === 'calendar' ? <CalendarView /> : <TableView />}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the event "{selectedEvent?.title}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SchedulerManage;
