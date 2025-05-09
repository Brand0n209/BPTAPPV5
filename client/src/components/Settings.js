import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Notification settings
  const [notif, setNotif] = useState({
    email: true,
    sms: false,
    push: true
  });

  // Appearance
  const [theme, setTheme] = useState('light');

  // Security
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  // Integrations
  const [googleConnected, setGoogleConnected] = useState(false);

  // Quote/Invoice Defaults
  const [defaults, setDefaults] = useState({
    defaultDiscount: '',
    defaultTax: '',
    defaultTerms: ''
  });

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotifChange = (e) => {
    setNotif({ ...notif, [e.target.name]: e.target.checked });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTwoFAChange = (e) => {
    setTwoFA(e.target.checked);
  };

  const handleGoogleConnect = () => {
    setGoogleConnected(!googleConnected);
    setNotification({
      open: true,
      message: googleConnected ? 'Google disconnected (demo).' : 'Google connected (demo).',
      severity: googleConnected ? 'warning' : 'success'
    });
  };

  const handleDefaultsChange = (e) => {
    setDefaults({ ...defaults, [e.target.name]: e.target.value });
  };

  const handleSave = (section) => {
    setNotification({
      open: true,
      message: `${section} settings saved (demo).`,
      severity: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
      <Paper elevation={2} sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Settings Tabs"
        >
          <Tab label="Profile" />
          <Tab label="Notifications" />
          <Tab label="Appearance" />
          <Tab label="Security" />
          <Tab label="Integrations" />
          <Tab label="Quote/Invoice Defaults" />
          <Tab label="Advanced" />
        </Tabs>
      </Paper>

      {/* Profile Tab */}
      <TabPanel value={tab} index={0}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => handleSave('Profile')}>
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tab} index={1}>
        <Card>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={notif.email}
                  onChange={handleNotifChange}
                  name="email"
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notif.sms}
                  onChange={handleNotifChange}
                  name="sms"
                />
              }
              label="SMS Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notif.push}
                  onChange={handleNotifChange}
                  name="push"
                />
              }
              label="Push Notifications"
            />
            <Box mt={2}>
              <Button variant="contained" onClick={() => handleSave('Notification')}>
                Save Notifications
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Appearance Tab */}
      <TabPanel value={tab} index={2}>
        <Card>
          <CardContent>
            <FormControl fullWidth>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                labelId="theme-select-label"
                value={theme}
                label="Theme"
                onChange={handleThemeChange}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2}>
              <Button variant="contained" onClick={() => handleSave('Appearance')}>
                Save Appearance
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={tab} index={3}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={twoFA}
                      onChange={handleTwoFAChange}
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => handleSave('Security')}>
                  Save Security
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Integrations Tab */}
      <TabPanel value={tab} index={4}>
        <Card>
          <CardContent>
            <Typography variant="body2" gutterBottom>
              Connect your account to third-party services.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={googleConnected}
                  onChange={handleGoogleConnect}
                />
              }
              label={googleConnected ? "Google Connected" : "Connect Google"}
            />
            <Box mt={2}>
              <Button variant="contained" onClick={() => handleSave('Integrations')}>
                Save Integrations
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Quote/Invoice Defaults Tab */}
      <TabPanel value={tab} index={5}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Default Discount"
                  name="defaultDiscount"
                  value={defaults.defaultDiscount}
                  onChange={handleDefaultsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Default Tax"
                  name="defaultTax"
                  value={defaults.defaultTax}
                  onChange={handleDefaultsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Default Terms"
                  name="defaultTerms"
                  value={defaults.defaultTerms}
                  onChange={handleDefaultsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => handleSave('Quote/Invoice Defaults')}>
                  Save Defaults
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Advanced Tab */}
      <TabPanel value={tab} index={6}>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Advanced settings and developer options.
            </Typography>
            <Button variant="outlined" color="error" sx={{ mt: 2 }}>
              Reset All Settings
            </Button>
          </CardContent>
        </Card>
      </TabPanel>

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
