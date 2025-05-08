import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  CalendarMonth as CalendarMonthIcon,
  Notifications as NotificationsIcon,
  Backup as BackupIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

function Settings() {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [settings, setSettings] = useState({
    company: {
      name: 'Bright Prodigy',
      email: 'info@brightprodigy.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Sonora, CA 95370',
      website: 'https://brightprodigy.com',
      logo: '/logo.png'
    },
    scheduling: {
      defaultAppointmentDuration: 60,
      workHoursStart: '08:00',
      workHoursEnd: '18:00',
      workDays: [1, 2, 3, 4, 5], // Monday to Friday
      bufferTime: 15,
      calendarSync: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      reminderTime: 24, // hours
      appointmentConfirmation: true,
      appointmentReminder: true,
      appointmentFollowUp: true
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: 365, // days
      darkMode: false,
      googleSheetsSync: true,
      debugMode: false
    },
    users: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSettings();
    fetchUsers();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      // Only update if we received data to avoid overwriting defaults
      if (data) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load settings. Using defaults.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setSettings(prevSettings => ({
        ...prevSettings,
        users: data
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      company: {
        ...settings.company,
        [name]: value
      }
    });
  };

  const handleSchedulingChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      scheduling: {
        ...settings.scheduling,
        [name]: value
      }
    });
  };

  const handleSchedulingToggle = (name) => {
    setSettings({
      ...settings,
      scheduling: {
        ...settings.scheduling,
        [name]: !settings.scheduling[name]
      }
    });
  };

  const handleNotificationsChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: value
      }
    });
  };

  const handleNotificationsToggle = (name) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: !settings.notifications[name]
      }
    });
  };

  const handleSystemChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        [name]: value
      }
    });
  };

  const handleSystemToggle = (name) => {
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        [name]: !settings.system[name]
      }
    });
  };

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save settings. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saveLoading}
        >
          {saveLoading ? <CircularProgress size={24} /> : 'Save Settings'}
        </Button>
      </Box>
      
      {/* Company Information */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="company-info-content"
          id="company-info-header"
        >
          <Typography variant="h6">Company Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="name"
                value={settings.company.name}
                onChange={handleCompanyChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={settings.company.email}
                onChange={handleCompanyChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={settings.company.phone}
                onChange={handleCompanyChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={settings.company.website}
                onChange={handleCompanyChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={settings.company.address}
                onChange={handleCompanyChange}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Scheduling Settings */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="scheduling-content"
          id="scheduling-header"
        >
          <Typography variant="h6">Scheduling Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Appointment Duration (minutes)"
                name="defaultAppointmentDuration"
                type="number"
                value={settings.scheduling.defaultAppointmentDuration}
                onChange={handleSchedulingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buffer Time Between Appointments (minutes)"
                name="bufferTime"
                type="number"
                value={settings.scheduling.bufferTime}
                onChange={handleSchedulingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Work Hours Start"
                name="workHoursStart"
                type="time"
                value={settings.scheduling.workHoursStart}
                onChange={handleSchedulingChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Work Hours End"
                name="workHoursEnd"
                type="time"
                value={settings.scheduling.workHoursEnd}
                onChange={handleSchedulingChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sync with Google Calendar" />
                  <Switch
                    edge="end"
                    checked={settings.scheduling.calendarSync}
                    onChange={() => handleSchedulingToggle('calendarSync')}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Notification Settings */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="notifications-content"
          id="notifications-header"
        >
          <Typography variant="h6">Notification Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Email Notifications" />
              <Switch
                edge="end"
                checked={settings.notifications.emailNotifications}
                onChange={() => handleNotificationsToggle('emailNotifications')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="SMS Notifications" />
              <Switch
                edge="end"
                checked={settings.notifications.smsNotifications}
                onChange={() => handleNotificationsToggle('smsNotifications')}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Appointment Confirmation" />
              <Switch
                edge="end"
                checked={settings.notifications.appointmentConfirmation}
                onChange={() => handleNotificationsToggle('appointmentConfirmation')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Appointment Reminder" />
              <Switch
                edge="end"
                checked={settings.notifications.appointmentReminder}
                onChange={() => handleNotificationsToggle('appointmentReminder')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Appointment Follow-up" />
              <Switch
                edge="end"
                checked={settings.notifications.appointmentFollowUp}
                onChange={() => handleNotificationsToggle('appointmentFollowUp')}
              />
            </ListItem>
          </List>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reminder Time (hours before appointment)"
                name="reminderTime"
                type="number"
                value={settings.notifications.reminderTime}
                onChange={handleNotificationsChange}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* System Settings */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="system-content"
          id="system-header"
        >
          <Typography variant="h6">System Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon>
                <BackupIcon />
              </ListItemIcon>
              <ListItemText primary="Automatic Backups" />
              <Switch
                edge="end"
                checked={settings.system.autoBackup}
                onChange={() => handleSystemToggle('autoBackup')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BackupIcon />
              </ListItemIcon>
              <ListItemText primary="Google Sheets Sync" />
              <Switch
                edge="end"
                checked={settings.system.googleSheetsSync}
                onChange={() => handleSystemToggle('googleSheetsSync')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Debug Mode" secondary="Enable for troubleshooting, disable for production" />
              <Switch
                edge="end"
                checked={settings.system.debugMode}
                onChange={() => handleSystemToggle('debugMode')}
              />
            </ListItem>
          </List>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="backup-frequency-label">Backup Frequency</InputLabel>
                <Select
                  labelId="backup-frequency-label"
                  name="backupFrequency"
                  value={settings.system.backupFrequency}
                  label="Backup Frequency"
                  onChange={handleSystemChange}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Retention (days)"
                name="dataRetention"
                type="number"
                value={settings.system.dataRetention}
                onChange={handleSystemChange}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* User Management */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="users-content"
          id="users-header"
        >
          <Typography variant="h6">User Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
            >
              Add User
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {settings.users.length > 0 ? (
                  settings.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={fetchSettings}
          sx={{ mr: 2 }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saveLoading}
        >
          {saveLoading ? <CircularProgress size={24} /> : 'Save Settings'}
        </Button>
      </Box>
      
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

export default Settings;
