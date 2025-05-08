import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Snackbar, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';

function SchedulerCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startTime: null,
    endTime: null,
    customerId: '',
    technicianId: '',
    eventType: '',
    location: '',
    notes: ''
  });

  const eventTypes = [
    'Consultation',
    'Installation',
    'Maintenance',
    'Repair',
    'Follow-up',
    'Other'
  ];

  useEffect(() => {
    // Fetch customers and technicians data
    fetchCustomers();
    fetchTechnicians();
  }, []);

  const fetchCustomers = async () => {
    setCustomerLoading(true);
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load customers. Please try again.',
        severity: 'error'
      });
    } finally {
      setCustomerLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/technicians');
      if (!response.ok) {
        throw new Error('Failed to fetch technicians');
      }
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load technicians. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (field, date) => {
    setEventData(prevState => ({
      ...prevState,
      [field]: date
    }));
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setEventData(prevState => ({
      ...prevState,
      customerId
    }));

    // If a customer is selected, try to pre-fill some fields
    if (customerId) {
      const selectedCustomer = customers.find(c => c.id === customerId);
      if (selectedCustomer) {
        setEventData(prevState => ({
          ...prevState,
          location: selectedCustomer.address || '',
          title: `${selectedCustomer.service || 'Appointment'} - ${selectedCustomer.firstName} ${selectedCustomer.lastName}`
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create calendar event
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error('Error creating calendar event');
      }
      
      setSnackbar({
        open: true,
        message: 'Event scheduled successfully!',
        severity: 'success'
      });
      
      // Redirect to manage scheduler after success
      setTimeout(() => {
        navigate('/scheduler-manage');
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to schedule event. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Schedule New Event
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Event Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="customer-label">Customer</InputLabel>
                <Select
                  labelId="customer-label"
                  name="customerId"
                  value={eventData.customerId}
                  label="Customer"
                  onChange={handleCustomerChange}
                  disabled={customerLoading}
                >
                  {customerLoading ? (
                    <MenuItem disabled>Loading customers...</MenuItem>
                  ) : (
                    customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="event-type-label">Event Type</InputLabel>
                <Select
                  labelId="event-type-label"
                  name="eventType"
                  value={eventData.eventType}
                  label="Event Type"
                  onChange={handleChange}
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Event Title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={eventData.description}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Date/Time */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Date and Time
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Time"
                  value={eventData.startTime}
                  onChange={(date) => handleDateChange('startTime', date)}
                  renderInput={(params) => <TextField {...params} required fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Time"
                  value={eventData.endTime}
                  onChange={(date) => handleDateChange('endTime', date)}
                  renderInput={(params) => <TextField {...params} required fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Additional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="technician-label">Technician</InputLabel>
                <Select
                  labelId="technician-label"
                  name="technicianId"
                  value={eventData.technicianId}
                  label="Technician"
                  onChange={handleChange}
                >
                  {technicians.map((tech) => (
                    <MenuItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={eventData.notes}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Schedule Event'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate('/scheduler-manage')}
                sx={{ mt: 2, ml: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
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

export default SchedulerCreate;
