const { Queue } = require('bullmq');
const { connection, defaultQueueOptions } = require('../../config/queue');

const messageQueue = new Queue('{message}', {
    connection,
    ...defaultQueueOptions,
});

module.exports = messageQueue;
