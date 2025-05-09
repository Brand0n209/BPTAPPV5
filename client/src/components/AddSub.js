import React, { useState } from 'react';
import { Box, Typography, Button, Grid, TextField, Select, MenuItem, Checkbox, FormControlLabel, Alert, Snackbar, CircularProgress } from '@mui/material';

const REFERRAL_OPTIONS = [
  'Yelp', 'Referral', 'Google', 'Instagram', 'Facebook', 'NextDoor'
];
const HOME_STORIES = [
  '1 Story', '2 Story', '3 Story', 'Commercial'
];
const LIGHTING_OPTIONS_TEMPORARY = [
  'Temporary Installation', 'Temporary Takedown', 'Temporary Service'
];
const LIGHTING_OPTIONS_PERMANENT = [
  'Permanent Installation', 'Permanent Takedown', 'Permanent Service', 'Garage/Doorway Lighting'
];
const LIGHTING_SIDES = [
  'Fence', 'Bottom Back', 'Back Side', 'Left Side', 'Right Side', 'Front Side'
];
const MEASURE_OPTIONS = [
  'Yes please!', 'No thanks!'
];
const SOLAR_SERVICES = [
  'Solar Cleaning', 'Solar Mesh'
];
const GUTTER_SERVICES = [
  'Full Gutter Cleaning', 'Partial Gutter Cleaning'
];

function AddSub() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    referral: '',
    address: '',
    city: '',
    homeStories: '',
    lightingOptions: [],
    lightingSides: [],
    prefServiceDateLighting: '',
    measure: '',
    lightingNotes: '',
    solarSelectedServices: [],
    prefServiceDateSolar: '',
    solarPanels: '',
    solarNotes: '',
    gutterSelectedService: [],
    prefServiceDateGutter: '',
    gutterNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // Handlers for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name, option) => {
    setForm((prev) => {
      const arr = prev[name];
      return {
        ...prev,
        [name]: arr.includes(option)
          ? arr.filter((v) => v !== option)
          : [...arr, option]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlert({ open: true, message: 'Submission successful! (simulated)', severity: 'success' });
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        referral: '',
        address: '',
        city: '',
        homeStories: '',
        lightingOptions: [],
        lightingSides: [],
        prefServiceDateLighting: '',
        measure: '',
        lightingNotes: '',
        solarSelectedServices: [],
        prefServiceDateSolar: '',
        solarPanels: '',
        solarNotes: '',
        gutterSelectedService: [],
        prefServiceDateGutter: '',
        gutterNotes: ''
      });
    }, 1200);
  };

  // Disable submit unless required fields are filled
  const isSubmitDisabled = !form.firstName || !form.lastName || !form.phone || !form.address || !form.city;

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: '0px',
        width: 'calc(100vw - 48px)',
        minHeight: 'calc(100vh - 48px)',
        background: '#f9fafb',
        pr: 1,
        pl: 0,
        overflowX: 'hidden',
        marginLeft: '0px'
      }}
    >
      <Box
        className="card"
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 'none',
          background: '#f7f9fb',
          width: '100%',
          maxWidth: '100%',
          mt: 4,
          mx: 'auto',
          overflowX: 'hidden'
        }}
      >
        <form id="addSubForm" autoComplete="off" onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <Grid container spacing={2}>
            {/* Name and Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                label="Referral"
                name="referral"
                value={form.referral}
                onChange={handleChange}
                required
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Select Referral</MenuItem>
                {REFERRAL_OPTIONS.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Address" name="address" value={form.address} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="City" name="city" value={form.city} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Select
                label="Home Stories"
                name="homeStories"
                value={form.homeStories}
                onChange={handleChange}
                required
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Select Home Stories</MenuItem>
                {HOME_STORIES.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </Grid>
            {/* Lighting Section - Custom Grid */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {/* Lighting Options (left, vertical) */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Lighting Options</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Temporary</Typography>
                    {LIGHTING_OPTIONS_TEMPORARY.map(opt => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={form.lightingOptions.includes(opt)}
                            onChange={() => handleCheckboxChange('lightingOptions', opt)}
                          />
                        }
                        label={opt}
                      />
                    ))}
                    <Typography variant="caption" sx={{ fontWeight: 600, mt: 1 }}>Permanent</Typography>
                    {LIGHTING_OPTIONS_PERMANENT.map(opt => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={form.lightingOptions.includes(opt)}
                            onChange={() => handleCheckboxChange('lightingOptions', opt)}
                          />
                        }
                        label={opt}
                      />
                    ))}
                  </Box>
                </Grid>
                {/* Lighting Sides (vertical, next col) */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Lighting Sides</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {LIGHTING_SIDES.map(opt => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={form.lightingSides.includes(opt)}
                            onChange={() => handleCheckboxChange('lightingSides', opt)}
                          />
                        }
                        label={opt}
                      />
                    ))}
                  </Box>
                </Grid>
                {/* Pref Service Date + Measure (stacked) */}
                <Grid item xs={12} sm={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Pref Service Date (LIGHTING)"
                      name="prefServiceDateLighting"
                      type="date"
                      value={form.prefServiceDateLighting}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <Select
                      label="Measure"
                      name="measure"
                      value={form.measure}
                      onChange={handleChange}
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="">Select Measure</MenuItem>
                      {MEASURE_OPTIONS.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Grid>
                {/* Lighting Notes (tall, right) */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Lighting notes"
                    name="lightingNotes"
                    value={form.lightingNotes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={8}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Solar Section - Custom Grid */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {/* Solar Options (left, vertical) */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Solar Selected Services</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {SOLAR_SERVICES.map(opt => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={form.solarSelectedServices.includes(opt)}
                            onChange={() => handleCheckboxChange('solarSelectedServices', opt)}
                          />
                        }
                        label={opt}
                      />
                    ))}
                  </Box>
                </Grid>
                {/* Pref Service Date + Panels (stacked) */}
                <Grid item xs={12} sm={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Pref Service Date (SOLAR)"
                      name="prefServiceDateSolar"
                      type="date"
                      value={form.prefServiceDateSolar}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Solar Panels"
                      name="solarPanels"
                      type="number"
                      value={form.solarPanels}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Box>
                </Grid>
                {/* Solar Notes (tall, right) */}
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Solar notes"
                    name="solarNotes"
                    value={form.solarNotes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={6}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Gutter Section - Custom Grid */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {/* Gutter Options (left, vertical) */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Gutter Selected Service</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {GUTTER_SERVICES.map(opt => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            checked={form.gutterSelectedService.includes(opt)}
                            onChange={() => handleCheckboxChange('gutterSelectedService', opt)}
                          />
                        }
                        label={opt}
                      />
                    ))}
                  </Box>
                </Grid>
                {/* Pref Service Date (stacked) */}
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Pref Service Date (GUTTER)"
                    name="prefServiceDateGutter"
                    type="date"
                    value={form.prefServiceDateGutter}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {/* Gutter Notes (tall, right) */}
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Gutter notes"
                    name="gutterNotes"
                    value={form.gutterNotes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={6}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitDisabled || loading}
                sx={{ mt: 2, fontSize: '1.1em', py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(240,240,240,0.7)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )}
        </form>
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

export default AddSub;
