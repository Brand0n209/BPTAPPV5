import React, { useState } from 'react';
import { Box, Typography, Button, Grid, TextField, Select, MenuItem, Alert, Snackbar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const CALENDAR_OPTIONS = [
  { value: '', label: 'Select Calendar' },
  { value: 'BP + Crew 1', label: 'BP + Crew 1' },
  { value: 'Crew 1 Only', label: 'Crew 1 Only' },
  { value: 'Pending', label: 'Pending' }
];

function SchedulerOngoing() {
  // State for event search
  const [eventSearch, setEventSearch] = useState('');
  const [eventResults, setEventResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  // State for ongoing event form
  const [form, setForm] = useState({
    serviceTitle: '',
    calendar: '',
    date: '',
    startTime: '',
    duration: 60,
    price: '',
    installers: [],
    eventAttributes: [],
    installerNotes: '',
    managementNotes: ''
  });

  // State for UI
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [formDisabled, setFormDisabled] = useState(true);

  // Handlers for event search
  const handleEventSearchChange = (e) => setEventSearch(e.target.value);

  const handleEventSearch = () => {
    // Simulate search (replace with API call)
    if (eventSearch.length < 3) {
      setEventResults([]);
      setAlert({ open: true, message: 'Please enter at least 3 characters to search', severity: 'warning' });
      return;
    }
    // Example: return a single fake event
    setEventResults([
      { id: 1, title: 'Install Lights', customer: 'Jane Smith', startTime: '2025-05-10T09:00', jobId: 'JS1234', price: '500', notes: 'Initial install', installers: 'John, Mike', crew: 'Crew 1' }
    ]);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventDetails(event);
    setFormDisabled(false);
    setAlert({ open: true, message: 'Form has been pre-filled with event data. All fields remain editable.', severity: 'info' });
    setForm((prev) => ({
      ...prev,
      serviceTitle: `(Finish) ${event.title}`,
      price: event.price,
      // Prefill other fields as needed
    }));
  };

  // Handlers for ongoing event form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handlers for multi-select (installers, eventAttributes)
  const handleMultiSelectChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert({ open: true, message: 'Ongoing event created (simulated).', severity: 'success' });
    // Reset form or redirect as needed
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: '48px' }}>
      <Grid container spacing={2}>
        {/* Left: Event Search Panel */}
        <Grid item xs={12} md={4}>
          <Box className="card mb-4" sx={{ p: 2, borderRadius: 2, boxShadow: 1, background: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Search for Previous Event</Typography>
            <Box className="mb-3">
              <label htmlFor="eventSearchInput" className="form-label">Search by Customer Name</label>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  id="eventSearchInput"
                  placeholder="Customer name"
                  size="small"
                  value={eventSearch}
                  onChange={handleEventSearchChange}
                  fullWidth
                />
                <Button variant="contained" onClick={handleEventSearch}>Search</Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                (type at least 3 characters of customer name)
              </Typography>
            </Box>
            {eventResults.length > 0 && (
              <Box id="eventSearchResults" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Select an event:</Typography>
                <ul className="list-group">
                  {eventResults.map((evt) => (
                    <li
                      key={evt.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectEvent(evt)}
                    >
                      <strong>{evt.title}</strong> ({evt.startTime})<br />
                      <small>{evt.customer}</small>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {eventDetails && (
              <Box id="eventDetailsPanel" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Selected Event Details</Typography>
                <ul className="list-group" id="eventDetailsList" style={{ padding: 0, margin: 0 }}>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Title:</strong> {eventDetails.title}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Customer:</strong> {eventDetails.customer}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Date:</strong> {eventDetails.startTime}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Job ID:</strong> {eventDetails.jobId}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Price:</strong> {eventDetails.price}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Notes:</strong> {eventDetails.notes}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Installers:</strong> {eventDetails.installers}</li>
                  <li className="list-group-item border-0 px-2 py-0"><strong>Crew:</strong> {eventDetails.crew}</li>
                </ul>
              </Box>
            )}
          </Box>
        </Grid>
        {/* Right: Ongoing Event Form */}
        <Grid item xs={12} md={8}>
          <Box className="card" sx={{ p: 2, borderRadius: 2, boxShadow: 1, background: '#fff' }}>
            <form id="ongoingEventForm" autoComplete="off" onSubmit={handleSubmit}>
              <Alert severity="info" sx={{ mb: 2, display: formDisabled ? 'block' : 'none' }}>
                <span>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 8 }} />
                  Please search and select a previous event before creating an ongoing event.
                </span>
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Service / Event Title"
                    name="serviceTitle"
                    value={form.serviceTitle}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Select
                    label="Calendar"
                    name="calendar"
                    value={form.calendar}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                    displayEmpty
                  >
                    {CALENDAR_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Start Time"
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Duration (minutes)"
                    name="duration"
                    type="number"
                    value={form.duration}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                    inputProps={{ min: 15, step: 15 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Spacer for layout */}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Installers"
                    name="installers"
                    value={form.installers.join(', ')}
                    onChange={e => handleMultiSelectChange('installers', e.target.value.split(',').map(s => s.trim()))}
                    required
                    fullWidth
                    disabled={formDisabled}
                    placeholder="Comma separated"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Select one or more installers.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Event Attributes"
                    name="eventAttributes"
                    value={form.eventAttributes.join(', ')}
                    onChange={e => handleMultiSelectChange('eventAttributes', e.target.value.split(',').map(s => s.trim()))}
                    required
                    fullWidth
                    disabled={formDisabled}
                    placeholder="Comma separated"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Select one or more event attributes.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Notes for Installers"
                    name="installerNotes"
                    value={form.installerNotes}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ADVISOR Notes for Management/Advisor"
                    name="managementNotes"
                    value={form.managementNotes}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    disabled={formDisabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formDisabled}
                  >
                    Create Ongoing Event
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
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

export default SchedulerOngoing;
