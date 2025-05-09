"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
    }
    // Log unexpected errors
    logger_1.logger.error('Unexpected error:', err);
    // Google API specific error handling
    if (err.message && err.message.includes('Google API')) {
        return res.status(500).json({
            status: 500,
            message: 'Error communicating with Google Calendar API',
            error: err.message
        });
    }
    // Default error response
    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map