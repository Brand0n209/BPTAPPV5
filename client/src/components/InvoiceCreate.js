import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  InputAdornment
} from '@mui/material';

function InvoiceCreate() {
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    invoiceNumber: '',
    date: '',
    price: '',
    discount: '',
    services: '',
    address: ''
  });

  // Event search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEventSearch = () => {
    // Placeholder: would call backend
    setLoading(true);
    setTimeout(() => {
      // Simulate search results
      setSearchResults([
        {
          id: 1,
          title: 'Holiday Lighting',
          startTime: '2025-05-01 10:00',
          customer: 'John Doe',
          price: '$1200',
          address: '123 Main St'
        },
        {
          id: 2,
          title: 'Permanent Install',
          startTime: '2025-04-15 14:00',
          customer: 'Jane Smith',
          price: '$1800',
          address: '456 Oak Ave'
        }
      ]);
      setLoading(false);
      setNotification({
        open: true,
        message: 'Search complete (sample data).',
        severity: 'info'
      });
    }, 800);
  };

  const handleEventSelect = (evt) => {
    setSelectedEvent(evt);
    setForm({
      ...form,
      firstName: evt.customer.split(' ')[0] || '',
      lastName: evt.customer.split(' ')[1] || '',
      price: evt.price || '',
      services: evt.title || '',
      address: evt.address || ''
    });
    setNotification({
      open: true,
      message: 'Event selected and form prefilled.',
      severity: 'success'
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setNotification({
      open: true,
      message: 'PDF generation not yet implemented.',
      severity: 'warning'
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 2 }}>
      <Grid container spacing={3}>
        {/* Event Search Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <TextField
                label="Search by Customer Name"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                size="small"
                placeholder="Customer name"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleEventSearch}
                        disabled={searchTerm.length < 3 || loading}
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  )
                }}
                helperText="Type at least 3 characters of customer name"
                margin="normal"
              />
              {searchResults.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select an event:
                  </Typography>
                  {searchResults.map((evt) => (
                    <Card
                      key={evt.id}
                      variant={selectedEvent && selectedEvent.id === evt.id ? 'outlined' : 'elevation'}
                      sx={{
                        mb: 1,
                        cursor: 'pointer',
                        borderColor: selectedEvent && selectedEvent.id === evt.id ? 'primary.main' : undefined,
                        background: selectedEvent && selectedEvent.id === evt.id ? '#e3f2fd' : undefined
                      }}
                      onClick={() => handleEventSelect(evt)}
                    >
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {evt.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {evt.startTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {evt.customer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {evt.address}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
              {selectedEvent && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Event Details
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body2"><b>Title:</b> {selectedEvent.title}</Typography>
                    <Typography variant="body2"><b>Date:</b> {selectedEvent.startTime.split(' ')[0]}</Typography>
                    <Typography variant="body2"><b>Time:</b> {selectedEvent.startTime.split(' ')[1]}</Typography>
                    <Typography variant="body2"><b>Customer:</b> {selectedEvent.customer}</Typography>
                    <Typography variant="body2"><b>Price:</b> {selectedEvent.price}</Typography>
                    <Typography variant="body2"><b>Address:</b> {selectedEvent.address}</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Invoice Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleFormSubmit} autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={form.invoiceNumber}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      name="date"
                      value={form.date}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      size="small"
                      placeholder="YYYY-MM-DD"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price"
                      name="price"
                      value={form.price}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Discount"
                      name="discount"
                      value={form.discount}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Services"
                      name="services"
                      value={form.services}
                      onChange={handleFormChange}
                      fullWidth
                      required
                      size="small"
                      placeholder="Enter services (comma separated)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={form.address}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={loading}
                    >
                      Generate PDF
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Notification Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InvoiceCreate;
