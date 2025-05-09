import React, { useState } from 'react';
import { Box, Typography, Button, Grid, TextField, Alert, Snackbar, Divider } from '@mui/material';

function ManageSubs() {
  // State for sub search
  const [subSearch, setSubSearch] = useState('');
  const [subResults, setSubResults] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);

  // State for sub form
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    referral: '',
    address: '',
    city: '',
    homeStories: '',
    lightingOptions: '',
    lightingSides: '',
    prefServiceDateLighting: '',
    measure: '',
    lightingNotes: '',
    solarSelectedServices: '',
    prefServiceDateSolar: '',
    solarPanels: '',
    solarNotes: '',
    gutterSelectedService: '',
    prefServiceDateGutter: '',
    gutterNotes: ''
  });

  // State for UI
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [uiState, setUiState] = useState('prompt'); // prompt, loading, results, empty, form

  // Handlers for sub search
  const handleSubSearchChange = (e) => setSubSearch(e.target.value);

  const handleSubSearch = () => {
    setUiState('loading');
    // Simulate search (replace with API call)
    setTimeout(() => {
      if (subSearch.length < 2) {
        setSubResults([]);
        setUiState('prompt');
        setAlert({ open: true, message: 'Please enter at least 2 characters to search', severity: 'warning' });
        return;
      }
      // Example: return a single fake sub
      setSubResults([
        { id: 1, firstName: 'Alice', lastName: 'Smith', phone: '555-9876', email: 'alice@example.com', address: '789 Pine Rd', city: 'Sample City', referral: 'Google' }
      ]);
      setUiState('results');
    }, 600);
  };

  const handleSelectSub = (sub) => {
    setSelectedSub(sub);
    setForm({ ...form, ...sub });
    setUiState('form');
  };

  // Handlers for sub form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setAlert({ open: true, message: 'Sub updated (simulated).', severity: 'success' });
    setUiState('prompt');
    setSelectedSub(null);
  };

  const handleDelete = () => {
    setAlert({ open: true, message: 'Sub deleted (simulated).', severity: 'success' });
    setUiState('prompt');
    setSelectedSub(null);
  };

  const handleCancel = () => {
    setUiState('prompt');
    setSelectedSub(null);
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: '48px', display: 'flex', height: 'calc(100vh - 48px)' }}>
      {/* Left: Sub Search Panel */}
      <Box
        sx={{
          width: 320,
          minWidth: 320,
          maxWidth: 320,
          background: '#fff',
          borderRight: '1px solid #e0e7ef',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Search Subs</Typography>
        <TextField
          id="subSearchInput"
          placeholder="Search by name, email, or phone"
          size="small"
          value={subSearch}
          onChange={handleSubSearchChange}
          fullWidth
          onKeyPress={e => { if (e.key === 'Enter') handleSubSearch(); }}
        />
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleSubSearch}>Search</Button>
        <Divider sx={{ my: 2 }} />
        {uiState === 'prompt' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You can edit subs and delete subs here!
          </Typography>
        )}
        {uiState === 'loading' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        )}
        {uiState === 'results' && subResults.length > 0 && (
          <Box id="subsListWrapper" sx={{ mt: 2, flex: 1, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Select a sub:</Typography>
            <ul className="list-group" style={{ padding: 0, margin: 0 }}>
              {subResults.map((sub) => (
                <li
                  key={sub.id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer', border: 'none', borderBottom: '1px solid #e0e7ef', padding: '12px 8px' }}
                  onClick={() => handleSelectSub(sub)}
                >
                  <strong>{sub.firstName} {sub.lastName}</strong><br />
                  <small>{sub.address}</small>
                </li>
              ))}
            </ul>
          </Box>
        )}
        {uiState === 'empty' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No Results
          </Typography>
        )}
      </Box>
      {/* Right: Sub Edit Form */}
      <Box sx={{ flex: 1, p: 4, overflowY: 'auto', background: '#f7f9fb' }}>
        {uiState === 'form' && (
          <Box className="card" sx={{ p: 3, borderRadius: 2, boxShadow: 1, background: '#fff', maxWidth: 700, margin: '0 auto' }}>
            <form id="editSubForm" autoComplete="off" onSubmit={handleUpdate}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Edit Sub</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFormChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Referral"
                    name="referral"
                    value={form.referral}
                    onChange={handleFormChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleFormChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    fullWidth
                  />
                </Grid>
                {/* Add more fields as needed, grouped as in the Apps Script UI */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    sx={{ ml: 2 }}
                  >
                    Delete Sub
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
        {uiState !== 'form' && (
          <Box sx={{ textAlign: 'center', color: '#888', mt: 8 }}>
            <Typography variant="body1">
              Select a sub from the left to edit or delete.
            </Typography>
          </Box>
        )}
      </Box>
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

export default ManageSubs;
