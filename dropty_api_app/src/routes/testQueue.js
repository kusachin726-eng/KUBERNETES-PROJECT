const express = require('express');
const router = express.Router();
const notificationQueue = require('../jobs/queues/notification');
const messageQueue = require('../jobs/queues/message');

/**
 * POST /test-queue/notification
 * Add single notification job
 */
router.post('/notification', async (req, res) => {
    try {
        const { type, recipient, content, userId } = req.body;

        // Validation
        if (!type || !recipient || !content) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields: type, recipient, content',
            });
        }

        if (!['email', 'push', 'sms'].includes(type)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid notification type. Must be: email, push, or sms',
            });
        }

        const job = await notificationQueue.add('send-notification', {
            type,
            recipient,
            content,
            userId,
            createdAt: new Date(),
        });

        res.json({
            status: true,
            message: 'Notification job added successfully',
            jobId: job.id,
            data: {
                jobId: job.id,
                type,
                recipient,
                status: 'pending',
            },
        });
    } catch (error) {
        console.error('[Route Error] Notification:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to add notification job',
            error: error.message,
        });
    }
});

/**
 * POST /test-queue/message
 * Add bulk message job with auto-splitting for large recipient lists
 */
router.post('/message', async (req, res) => {
    try {
        const { recipients, messageBody } = req.body;
        const MAX_RECIPIENTS_PER_JOB = 500; // Split if exceeds this

        // Validation
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Invalid request: recipients must be a non-empty array',
            });
        }

        if (!messageBody || typeof messageBody !== 'string') {
            return res.status(400).json({
                status: false,
                message: 'Invalid request: messageBody must be a non-empty string',
            });
        }

        const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const jobIds = [];

        // Split large recipient lists into multiple jobs
        if (recipients.length > MAX_RECIPIENTS_PER_JOB) {
            console.log(
                `[Route] Splitting ${recipients.length} recipients into multiple jobs`
            );

            const numBatches = Math.ceil(recipients.length / MAX_RECIPIENTS_PER_JOB);

            for (let i = 0; i < numBatches; i++) {
                const start = i * MAX_RECIPIENTS_PER_JOB;
                const end = Math.min(start + MAX_RECIPIENTS_PER_JOB, recipients.length);
                const batchRecipients = recipients.slice(start, end);

                const job = await messageQueue.add(
                    'send-bulk-message',
                    {
                        recipients: batchRecipients,
                        messageBody,
                        batchId,
                        batchNumber: i + 1,
                        totalBatches: numBatches,
                        createdAt: new Date(),
                    },
                    {
                        priority: 5, // Normal priority
                    }
                );

                jobIds.push(job.id);
            }
        } else {
            // Single job for smaller lists
            const job = await messageQueue.add(
                'send-bulk-message',
                {
                    recipients,
                    messageBody,
                    batchId,
                    batchNumber: 1,
                    totalBatches: 1,
                    createdAt: new Date(),
                },
                {
                    priority: 5,
                }
            );

            jobIds.push(job.id);
        }

        res.json({
            status: true,
            message: `Bulk message job(s) added successfully`,
            batchId,
            jobIds,
            data: {
                batchId,
                jobCount: jobIds.length,
                totalRecipients: recipients.length,
                recipientsPerJob:
                    recipients.length > MAX_RECIPIENTS_PER_JOB
                        ? MAX_RECIPIENTS_PER_JOB
                        : recipients.length,
                status: 'pending',
            },
        });
    } catch (error) {
        console.error('[Route Error] Message:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to add bulk message job',
            error: error.message,
        });
    }
});

/**
 * GET /test-queue/job/:jobId
 * Get job status and progress
 */
router.get('/job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;

        // Try both queues
        let job =
            (await notificationQueue.getJob(jobId)) ||
            (await messageQueue.getJob(jobId));

        if (!job) {
            return res.status(404).json({
                status: false,
                message: `Job ${jobId} not found`,
            });
        }

        const progress = job.progress() || 0;
        const state = await job.getState();

        res.json({
            status: true,
            job: {
                id: job.id,
                name: job.name,
                data: job.data,
                state,
                progress,
                attempts: job.attemptsMade,
                maxAttempts: job.opts.attempts,
                result: job.returnvalue,
                error: job.failedReason,
                createdAt: job.createdAt,
                completedAt: job.completedTimestamp,
                retriedAt: job.retriedTimestamp,
            },
        });
    } catch (error) {
        console.error('[Route Error] Get job:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch job status',
            error: error.message,
        });
    }
});

/**
 * GET /test-queue/batch/:batchId
 * Get all jobs for a batch
 */
router.get('/batch/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Get all jobs from both queues
        const notificationJobs = await notificationQueue.getJobs(
            ['completed', 'failed', 'waiting', 'active'],
            0,
            -1
        );
        const messageJobs = await messageQueue.getJobs(
            ['completed', 'failed', 'waiting', 'active'],
            0,
            -1
        );

        const batchJobs = [
            ...notificationJobs.filter((j) => j.data?.batchId === batchId),
            ...messageJobs.filter((j) => j.data?.batchId === batchId),
        ];

        if (batchJobs.length === 0) {
            return res.status(404).json({
                status: false,
                message: `No jobs found for batch ${batchId}`,
            });
        }

        const stats = {
            total: batchJobs.length,
            completed: 0,
            failed: 0,
            active: 0,
            waiting: 0,
        };

        const jobs = await Promise.all(
            batchJobs.map(async (job) => {
                const state = await job.getState();
                stats[state]++;

                return {
                    id: job.id,
                    name: job.name,
                    state,
                    progress: job.progress() || 0,
                    result: job.returnvalue,
                    error: job.failedReason,
                };
            })
        );

        res.json({
            status: true,
            batchId,
            stats,
            jobs,
        });
    } catch (error) {
        console.error('[Route Error] Get batch:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch batch status',
            error: error.message,
        });
    }
});

module.exports = router;
