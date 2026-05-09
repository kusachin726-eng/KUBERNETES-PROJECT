const { Worker } = require('bullmq');
const { connection } = require('../../config/queue');

// Process up to 5 bulk message jobs concurrently
const messageWorker = new Worker(
    '{message}',
    async (job) => {
        console.log(`[Message Worker] Processing job ${job.id} - ${job.data.recipients.length} recipients`);

        const { recipients, messageBody, batchId } = job.data;
        const results = {
            status: 'processing',
            totalRecipients: recipients.length,
            successful: 0,
            failed: 0,
            errors: [],
        };

        try {
            // Process in parallel batches for better performance
            const BATCH_SIZE = 10;
            const batches = [];

            for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
                batches.push(recipients.slice(i, i + BATCH_SIZE));
            }

            // Process each batch in parallel
            for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                const batch = batches[batchIndex];

                try {
                    // Simulate parallel sending within batch
                    await Promise.allSettled(
                        batch.map(async (recipient) => {
                            // await sendMessage(recipient, messageBody);
                            console.log(`- Sent to ${recipient}`);
                            results.successful++;
                        })
                    );

                    // Report progress to client
                    const progress = Math.round(
                        ((batchIndex + 1) / batches.length) * 100
                    );
                    await job.updateProgress(progress);
                } catch (batchError) {
                    results.failed += batch.length;
                    results.errors.push({
                        batchIndex,
                        error: batchError.message,
                    });
                }
            }

            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            results.status = 'completed';
            results.completedAt = new Date();

            console.log(
                `[Message Worker] Job ${job.id} completed: ${results.successful}/${results.totalRecipients} successful`
            );

            return results;
        } catch (error) {
            console.error(`[Message Worker] Job ${job.id} failed:`, error);
            results.status = 'failed';
            results.error = error.message;
            throw error;
        }
    },
    {
        connection,
        concurrency: 5, // Process max 5 bulk jobs concurrently
    }
);

// Lifecycle event handlers
messageWorker.on('progress', (job, progress) => {
    console.log(`[Message Worker] Job ${job.id} progress: ${progress}%`);
});

messageWorker.on('completed', (job) => {
    const data = job.returnvalue || {};
    console.log(
        `[Message Worker] Job ${job.id} completed - Success: ${data.successful}/${data.totalRecipients}`
    );
});

messageWorker.on('failed', (job, err) => {
    console.error(`[Message Worker] Job ${job.id} failed:`, err.message);
});

messageWorker.on('error', (err) => {
    console.error('[Message Worker] Worker error:', err);
});

module.exports = messageWorker;
