const { Queue } = require('bullmq');
const { connection, defaultQueueOptions } = require('../../config/queue');

const notificationQueue = new Queue('{notification}', {
    connection,
    ...defaultQueueOptions,
});

module.exports = notificationQueue;
