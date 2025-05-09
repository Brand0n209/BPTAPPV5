import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import calendarService from '../services/calendarService';

function SchedulerCreate() {
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    location: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour later
    calendarId: 'pending' // Default to pending calendar
  });
  
  const [formErrors, setFormErrors] = useState({
    summary: '',
    start: '',
    end: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const [calendars, setCalendars] = useState([]);
  
  // Initialize calendars
  useEffect(() => {
    const options = calendarService.getCalendarOptions()
      .filter(cal => cal.value !== 'all'); // Remove "All Calendars" option
    
    setCalendars(options);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date
    });
    
    // Clear error when field is edited
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {
      summary: '',
      start: '',
      end: ''
    };
    
    let isValid = true;
    
    // Check required fields
    if (!formData.summary.trim()) {
      errors.summary = 'Event title is required';
      isValid = false;
    }
    
    if (!formData.start) {
      errors.start = 'Start date/time is required';
      isValid = false;
    }
    
    if (!formData.end) {
      errors.end = 'End date/time is required';
      isValid = false;
    }
    
    // Check start is before end
    if (formData.start && formData.end && formData.end <= formData.start) {
      errors.end = 'End time must be after start time';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const eventData = {
        summary: formData.summary,
        description: formData.description,
        location: formData.location,
        start: {
          dateTime: formData.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: formData.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      const result = await calendarService.createEvent(formData.calendarId, eventData);
      
      setAlert({
        open: true,
        message: 'Event created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        summary: '',
        description: '',
        location: '',
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000),
        calendarId: 'pending'
      });
      
    } catch (err) {
      console.error('Error creating event:', err);
      setAlert({
        open: true,
        message: `Failed to create event: ${err.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, marginTop: '48px' }}>
        <Paper 
          elevation={2}
          sx={{
            maxWidth: 800,
            mx: 'auto',
            p: 3,
            borderRadius: 2
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Create New Calendar Event
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Event Title"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!formErrors.summary}
                  helperText={formErrors.summary}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={formData.start}
                  onChange={handleDateChange('start')}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!formErrors.start}
                      helperText={formErrors.start}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Date & Time"
                  value={formData.end}
                  onChange={handleDateChange('end')}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!formErrors.end}
                      helperText={formErrors.end}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Calendar</InputLabel>
                  <Select
                    name="calendarId"
                    value={formData.calendarId}
                    onChange={handleInputChange}
                    label="Calendar"
                  >
                    {calendars.map((cal) => (
                      <MenuItem key={cal.value} value={cal.value}>
                        {cal.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select which calendar to use</FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Optional location for this event"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Details about this event"
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Event'}
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{ ml: 2 }}
                  onClick={() => {
                    // Reset form
                    setFormData({
                      summary: '',
                      description: '',
                      location: '',
                      start: new Date(),
                      end: new Date(new Date().getTime() + 60 * 60 * 1000),
                      calendarId: 'pending'
                    });
                    setFormErrors({
                      summary: '',
                      start: '',
                      end: ''
                    });
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
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
    </LocalizationProvider>
  );
}

export default SchedulerCreate;
