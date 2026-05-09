const { redisConnection } = require('./redis/queue');

/**
 * Common configuration for BullMQ queues and workers
 */
const connection = {
    host: redisConnection.host,
    port: redisConnection.port,
    password: redisConnection.password,
    tls: redisConnection.tlsEnabled,
    // Add password if your redis has one, e.g.:
    // password: process.env.REDIS_PASSWORD
    // Suppress BullMQ Redis version warnings
    lazyConnect: false,
};

const defaultQueueOptions = {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: {
            age: 24 * 3600, // Keep for 24 hours
            count: 1000,
        },
        removeOnFail: {
            age: 7 * 24 * 3600, // Keep for 7 days
            count: 5000,
        },
    },
    // Suppress Redis version warnings (Redis 6.0.16+ is compatible)
    logger: {
        log: () => {},
        debug: () => {},
        info: () => {},
        warn: (msg) => {
            // Only log non-version warnings
            if (!msg?.includes?.('Redis version')) {
                console.warn(msg);
            }
        },
        error: (msg) => console.error(msg),
    },
};

module.exports = {
    connection,
    defaultQueueOptions,
};
