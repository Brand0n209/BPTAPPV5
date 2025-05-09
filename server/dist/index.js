"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
// Routes
const calendar_1 = __importDefault(require("./routes/calendar"));
// Initialize Express app
const app = (0, express_1.default)();
const PORT = config_1.config.port;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Health check endpoints
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});
// API Routes
app.use('/api/calendar', calendar_1.default);
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
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
// Error handling middleware (must be after all routes)
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`Server running in ${config_1.config.environment} mode on port ${PORT}`);
});
// For cleaner error handling with unhandled exceptions
process.on('unhandledRejection', (err) => {
    logger_1.logger.error('UNHANDLED REJECTION:', err);
    logger_1.logger.error(err.stack || '');
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error('UNCAUGHT EXCEPTION:', err);
    logger_1.logger.error(err.stack || '');
    // In production, we might want to gracefully shut down
    // process.exit(1);
});
//# sourceMappingURL=index.js.map