

class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);

        // Custom logging for specific error codes
        if (statusCode === 404) {
            console.log(`404 Error: ${message}`);
        } else if (statusCode === 500) {
            console.log(`500 Error: ${message}`);
        }
    }
}

module.exports = AppError;