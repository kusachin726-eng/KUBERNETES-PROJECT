const process = require('process');
const { createLogger, transports, format } = require("winston");

// Log format used by both loggers
const logFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const colorizer = format.colorize();
colorizer.addColors({
    info: 'green',
    warn: 'yellow',
    error: 'red',
});

// Logger for console output
const consoleLogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }), // Colorize output for console
        logFormat
    ),
    transports: [
        new transports.Console()
    ]
});

// Logger for file output (logging only errors)
const fileLogger = createLogger({
    level: 'info', // Logs only error messages
    format: format.combine(
        format.timestamp(),
        format.json() // JSON format for the log file
    ),
    transports: [
        new transports.File({
            filename: 'logs/info.log',
            level: 'info'
        })
    ]
});

const logger = createLogger({
    format: format.combine(
        format.colorize({ all: true }),
        format.printf(({ message }) => message)
    ),
    transports: [
        new transports.Console()
    ]
});

// Function to log request details on console
function logRequest(req) {
    const label = req.path.replace(/\//g, '-');
    if (req.body && Object.keys(req.body).length > 0) {
        const formattedBody = JSON.stringify(req.body, null, 2);
        consoleLogger.info(`[Request: ${req.method} ${req.originalUrl} with body: ${formattedBody}]`, { label });
    } else {
        consoleLogger.info(`[Request: ${req.method} ${req.originalUrl}]`, { label });
    }
    return label;
}

// Function to log response details on file
function modifySendResponse(req, res) {
    let oldSend = res.send;
    res.send = function (response) {
        try {
            if (typeof response === 'string' && response.startsWith('{')) {
                fileLogger.info(JSON.parse(response));
            } else {
                fileLogger.info(response);
            }
            // Log error responses on console
            if (res.statusCode >= 400) {
                let errorResponse = response;
                if (typeof response === 'string' && response.startsWith('{')) {
                    errorResponse = JSON.parse(response)
                }
                consoleLogger.log({
                    level: 'error',
                    message: `${errorResponse.stack ? errorResponse.stack : ""} - ${errorResponse.msg ? errorResponse.msg : errorResponse.message} - userInfo: ${req.user ? JSON.stringify(req.user) : "No user info"}`,
                });
                const errorDetails = {
                    statusCode: res.statusCode,
                    method: req.method,
                    url: req.originalUrl || req.url,
                    body: req.body, // This assumes req.body is already parsed by a body parser
                    level: 'error',
                    message: `${errorResponse.stack ? errorResponse.stack : ""} - ${errorResponse.msg ? errorResponse.msg : errorResponse.message} - userInfo: ${req.user ? JSON.stringify(req.user) : "No user info"}`,
                };
                if (process.env.NODE_ENV === 'production') {
                    //sendErrorToSlack(errorDetails);
                }
            }
        } catch (err) {
            fileLogger.error("Error logging response:", err);
        }
        oldSend.apply(res, arguments);
    };
}

// Function to log response time and status code
function logResponseTime(req, res, startHrTime, label) {
    // Listen for the 'finish' event to log the response time
    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        let logLevel = 'info';
        if (res.statusCode >= 500) {
            logLevel = 'error';
        } else if (res.statusCode >= 400) {
            logLevel = 'error';
        } else if (elapsedTimeInMs > 1000 && res.statusCode < 300) {
            logLevel = 'warn';
        }

        consoleLogger.log({
            level: logLevel,
            message: `[Response sent: ${req.method} ${req.originalUrl} - ${res.statusCode} - ${elapsedTimeInMs.toFixed(3)} ms]`,
            label,
            responseTime: `${elapsedTimeInMs.toFixed(3)} ms`,
            statusCode: res.statusCode
        });
    });
}


// Middleware function to be used in routes
function loggerMiddleware(req, res, next) {
    const startHrTime = process.hrtime();
    const label = logRequest(req);  // Log request
    modifySendResponse(req, res);        // Modify send to log response
    logResponseTime(req, res, startHrTime, label);  // Log response time and status    

    next();
}

async function sendErrorToSlack(errorDetails) {
    const webhookURL = 'https://hooks.slack.com/services/hhhhh'

    const message = {
        text: `🚨 *Error Detected in API - ${errorDetails.message} *\n\n
        *Status Code:* ${errorDetails.statusCode}\n
        *Method:* ${errorDetails.method}\n
        *URL:* ${errorDetails.url}\n
        *Body:* \`\`\`${JSON.stringify(errorDetails.body, null, 2)}\`\`\`\n
        *Message:* \`\`\`${JSON.stringify(errorDetails.message, null, 2)}\`\`\``,
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            console.error('Failed to send error to Slack:', response.statusText);
        }
    } catch (error) {
        console.error('Error while sending message to Slack:', error.message);
    }
}


module.exports = { loggerMiddleware, consoleLogger, fileLogger, logger };

