const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tlsEnabled: process.env.REDIS_TLS_ENABLED === 'true',
}

const queueOptions = {
    delay: 5000,
    removeOnComplete: {
        count: 100,
        age: 1000 * 60 * 60 * 24 * 7,
    },
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000,
    },
    removeOnFail: {
        count: 50,   // Keep 50 failed jobs for debugging
        age: 1000 * 60 * 60 * 24 * 3, // Keep for 3 days
    },

}

module.exports = { redisConnection, queueOptions }