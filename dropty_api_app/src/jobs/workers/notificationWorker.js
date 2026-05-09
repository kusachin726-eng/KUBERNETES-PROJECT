const { Worker } = require('bullmq');
const { connection } = require('../../config/queue');

// Process up to 10 notification jobs concurrently
const notificationWorker = new Worker(
    '{notification}',
    async (job) => {
        console.log(`[Notification Worker] Processing job ${job.id}`);

        const { type, recipient, content, userId } = job.data;
        const startTime = Date.now();

        try {
            // Validate input
            if (!type || !recipient || !content) {
                throw new Error('Missing required fields: type, recipient, content');
            }

            if (!['email', 'push', 'sms'].includes(type)) {
                throw new Error(`Invalid notification type: ${type}`);
            }

            // Process based on type
            switch (type) {
                case 'email':
                    // await sendEmail(recipient, content);
                    console.log(`[Notification] Sending email to ${recipient}`);
                    break;
                case 'push':
                    // await sendPushNotification(userId, content);
                    console.log(`[Notification] Sending push to user ${userId}`);
                    break;
                case 'sms':
                    // await sendSMS(recipient, content);
                    console.log(`[Notification] Sending SMS to ${recipient}`);
                    break;
            }

            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 500));

            const processingTime = Date.now() - startTime;
            console.log(
                `[Notification Worker] Job ${job.id} completed in ${processingTime}ms`
            );

            return {
                status: 'sent',
                type,
                recipient,
                timestamp: new Date(),
                processingTimeMs: processingTime,
            };
        } catch (error) {
            console.error(`[Notification Worker] Job ${job.id} failed:`, error.message);
            throw error;
        }
    },
    {
        connection,
        concurrency: 10, // Process max 10 notifications concurrently
    }
);

// Lifecycle event handlers
notificationWorker.on('progress', (job, progress) => {
    console.log(`[Notification Worker] Job ${job.id} progress: ${progress}%`);
});

notificationWorker.on('completed', (job) => {
    const data = job.returnvalue || {};
    console.log(
        `[Notification Worker] Job ${job.id} completed - Type: ${data.type}`
    );
});

notificationWorker.on('failed', (job, err) => {
    console.error(
        `[Notification Worker] Job ${job.id} failed:`,
        err.message
    );
});

notificationWorker.on('error', (err) => {
    console.error('[Notification Worker] Worker error:', err);
});

module.exports = notificationWorker;
