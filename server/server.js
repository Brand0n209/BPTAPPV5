const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Google API setup
const setupGoogleApis = async () => {
  try {
    // This will be configured with service account credentials in production
    console.log('Setting up Google APIs...');
    
    // In production, we'll use a service account with proper scopes
    // For development, we'll need to set up OAuth2 flow
  } catch (error) {
    console.error('Error setting up Google APIs:', error);
  }
};

// API Routes
// GET - Fetch submissions
app.get('/api/submissions', async (req, res) => {
  try {
    // This will be implemented to fetch from Google Sheets
    res.json({ message: 'Fetching submissions - To be implemented' });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Add submission
app.post('/api/submissions', async (req, res) => {
  try {
    // This will be implemented to add to Google Sheets
    res.json({ message: 'Adding submission - To be implemented' });
  } catch (error) {
    console.error('Error adding submission:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update submission
app.put('/api/submissions/:rowIndex', async (req, res) => {
  try {
    // This will be implemented to update Google Sheets
    res.json({ message: 'Updating submission - To be implemented' });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete submission
app.delete('/api/submissions/:rowIndex', async (req, res) => {
  try {
    // This will be implemented to delete from Google Sheets
    res.json({ message: 'Deleting submission - To be implemented' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calendar Routes
// GET - Fetch calendar events
app.get('/api/calendar/events', async (req, res) => {
  try {
    // This will be implemented to fetch from Google Calendar
    res.json({ message: 'Fetching calendar events - To be implemented' });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Create calendar event
app.post('/api/calendar/events', async (req, res) => {
  try {
    // This will be implemented to create in Google Calendar
    res.json({ message: 'Creating calendar event - To be implemented' });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update calendar event
app.put('/api/calendar/events/:eventId', async (req, res) => {
  try {
    // This will be implemented to update in Google Calendar
    res.json({ message: 'Updating calendar event - To be implemented' });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete calendar event
app.delete('/api/calendar/events/:eventId', async (req, res) => {
  try {
    // This will be implemented to delete from Google Calendar
    res.json({ message: 'Deleting calendar event - To be implemented' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quote Tools Routes
app.get('/api/quote-tools/customers', async (req, res) => {
  try {
    // This will be implemented to search customers for quote tools
    res.json({ message: 'Searching quote tools customers - To be implemented' });
  } catch (error) {
    console.error('Error searching quote tools customers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  setupGoogleApis();
});
