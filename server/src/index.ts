import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import 'dotenv/config';

import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Routes
import calendarRoutes from './routes/calendar';

// Initialize Express app
const app = express();
const PORT = config.port;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://bright-prodigy-app-923339654929.us-west2.run.app'];

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://bright-prodigy-app-923339654929.us-west2.run.app'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../server/public')));

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// API Routes
app.use('/api/calendar', calendarRoutes);

// Dashboard API Endpoints (Temporary)
// - These can be migrated to proper controllers/routes later
app.get('/api/dashboard/status', (req, res) => {
  res.json({ status: 'All systems operational' });
});

app.get('/api/dashboard/usage', (req, res) => {
  res.json({
    users: 42,
    jobs: 128,
    invoices: 87,
    revenue: 24500
  });
});

app.get('/api/dashboard/activity', (req, res) => {
  res.json([
    { type: 'Job', desc: 'Created event for John Doe', time: '2 min ago' },
    { type: 'Invoice', desc: 'Generated invoice #1023', time: '10 min ago' },
    { type: 'User', desc: 'Added new sub Alice Smith', time: '1 hour ago' }
  ]);
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Error handling middleware (must be after all routes)
app.use(errorHandler as express.ErrorRequestHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${config.environment} mode on port ${PORT}`);
});

// For cleaner error handling with unhandled exceptions
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION:', err);
  logger.error(err.stack || '');
});

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION:', err);
  logger.error(err.stack || '');
  // In production, we might want to gracefully shut down
  // process.exit(1);
});
