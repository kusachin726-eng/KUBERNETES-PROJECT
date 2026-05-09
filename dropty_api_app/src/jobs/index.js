const cron = require('node-cron');

// Suppress Redis version warnings during initialization
// BullMQ emits version warnings when connecting to Redis
const originalConsoleWarn = console.warn;
const suppressWarnings = (msg) => {
    const msgStr = msg?.toString?.() || '';
    if (!msgStr.includes('recommended to use a minimum Redis version')) {
        originalConsoleWarn(msg);
    }
};

// Override console.warn for the entire initialization phase
console.warn = suppressWarnings;

// Import Queues (to ensure they are created)
const notificationQueue = require('./queues/notification');
const messageQueue = require('./queues/message');

// Import Workers (to start processing)
const notificationWorker = require('./workers/notificationWorker');
const messageWorker = require('./workers/messageWorker');

// Keep warnings suppressed longer since BullMQ connects asynchronously
// Restore after a brief delay to allow all connections to complete
setTimeout(() => {
    console.warn = originalConsoleWarn;
}, 2000);

// Schedule the refresh to run every hour
// Every minute: * * * * *
// Every 5 minutes: */5 * * * *
// Every hour: 0 * * * *
// Every day at midnight: 0 0 * * *


const startApp = async () => {
  try {
      console.log('Starting Job Queues and Workers...');
      // Workers start automatically upon instantiation
      console.log('Notification and Message workers started.');
      
  } catch (error) {
    console.error('Error starting jobs:', error);
  }
};

module.exports = startApp;