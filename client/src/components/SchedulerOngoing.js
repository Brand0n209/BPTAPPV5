import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

function SchedulerOngoing() {
  const [loading, setLoading] = useState(true);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchOngoingEvents();
  }, []);

  const fetchOngoingEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calendar/events/ongoing');
      if (!response.ok) {
        throw new Error('Failed to fetch ongoing events');
      }
      const data = await response.json();
      setOngoingEvents(data);
    } catch (error) {
      console.error('Error fetching ongoing events:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load ongoing events. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (event, appointmentEvent) => {
    setSelectedEvent(appointmentEvent);
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
  };

  const handleCompleteClick = () => {
    setActionMenuAnchor(null);
    setNotesDialogOpen(true);
  };

  const handleCancelClick = () => {
    setActionMenuAnchor(null);
    setCancelDialogOpen(true);
  };

  const handleNotesChange = (e) => {
    setCompletionNotes(e.target.value);
  };

  const handleNotesSubmit = async () => {
    if (!selectedEvent) return;

    setNotesDialogOpen(false);
    setCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/calendar/events/${selectedEvent.id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: completionNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete event');
      }

      setOngoingEvents(ongoingEvents.filter(evt => evt.id !== selectedEvent.id));
      setSnackbar({
        open: true,
        message: 'Event marked as completed',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error completing event:', error);
      setSnackbar({
        open: true,
        message: 'Failed to complete event. Please try again.',
        severity: 'error'
      });
    } finally {
      setCompleteDialogOpen(false);
      setCompletionNotes('');
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/calendar/events/${selectedEvent.id}/cancel`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel event');
      }

      setOngoingEvents(ongoingEvents.filter(evt => evt.id !== selectedEvent.id));
      setSnackbar({
        open: true,
        message: 'Event canceled successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error canceling event:', error);
      setSnackbar({
        open: true,
        message: 'Failed to cancel event. Please try again.',
        severity: 'error'
      });
    } finally {
      setCancelDialogOpen(false);
    }
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

  const getEventStatusChip = (status) => {
    switch (status) {
      case 'scheduled':
        return <Chip label="Scheduled" color="primary" size="small" />;
      case 'in-progress':
        return <Chip label="In Progress" color="secondary" size="small" />;
      case 'late':
        return <Chip label="Late" color="error" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const getTechnicianEvents = (technicianId) => {
    return ongoingEvents.filter(event => event.technicianId === technicianId);
  };

  const getTechnicians = () => {
    const technicians = [];
    const technicianIds = new Set();
    
    ongoingEvents.forEach(event => {
      if (event.technician && !technicianIds.has(event.technician.id)) {
        technicianIds.add(event.technician.id);
        technicians.push(event.technician);
      }
    });
    
    return technicians;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const technicians = getTechnicians();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ongoing Schedule
      </Typography>
      
      {technicians.length > 0 ? (
        technicians.map((technician) => {
          const techEvents = getTechnicianEvents(technician.id);
          
          return (
            <Paper key={technician.id} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {technician.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {techEvents.length > 0 ? (
                  techEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" component="div" noWrap>
                              {event.title}
                            </Typography>
                            {getEventStatusChip(event.status)}
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Customer:</strong> {event.customer?.firstName} {event.customer?.lastName}
                          </Typography>
                          
                          <Typography variant="body2" noWrap>
                            <strong>Location:</strong> {event.location || 'No location set'}
                          </Typography>
                          
                          {event.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Details:</strong> {event.description}
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between' }}>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success"
                            onClick={handleCompleteClick}
                          >
                            Complete
                          </Button>
                          <IconButton
                            size="small"
                            onClick={(e) => handleActionClick(e, event)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      No ongoing events for this technician
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          );
        })
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No ongoing events found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            There are currently no active events in the system.
          </Typography>
        </Paper>
      )}
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleCompleteClick}>
          <DoneIcon fontSize="small" sx={{ mr: 1 }} />
          Mark as Completed
        </MenuItem>
        <MenuItem onClick={handleCancelClick}>
          <CancelIcon fontSize="small" sx={{ mr: 1 }} />
          Cancel Event
        </MenuItem>
      </Menu>
      
      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)}>
        <DialogTitle>Completion Notes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add any notes about this installation or service before marking it as complete:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="notes"
            label="Notes"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={completionNotes}
            onChange={handleNotesChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNotesSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Complete Confirmation Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this event as completed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCompleteConfirm} color="success" autoFocus>
            Complete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Cancel Event
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

export default SchedulerOngoing;
