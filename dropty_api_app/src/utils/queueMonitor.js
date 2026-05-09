/**
 * Queue Monitoring Utility
 * Provides metrics and insights into BullMQ queue health
 */

const notificationQueue = require('../jobs/queues/notification');
const messageQueue = require('../jobs/queues/message');

class QueueMonitor {
    constructor(queues = []) {
        this.queues = queues || [
            { name: 'notification', queue: notificationQueue },
            { name: 'message', queue: messageQueue },
        ];
    }

    /**
     * Get comprehensive queue stats
     */
    async getQueueStats() {
        const stats = {};

        for (const { name, queue } of this.queues) {
            const counts = await queue.getJobCounts();
            const jobsData = await Promise.all([
                queue.getJobs(['completed'], 0, 99),
                queue.getJobs(['failed'], 0, 99),
                queue.getJobs(['active'], 0, 99),
                queue.getJobs(['waiting'], 0, 99),
                queue.getJobs(['delayed'], 0, 99),
            ]);

            const [completed, failed, active, waiting, delayed] = jobsData;

            stats[name] = {
                counts,
                recent: {
                    completed: completed.slice(0, 5).map((j) => ({
                        id: j.id,
                        data: j.data,
                        result: j.returnvalue,
                    })),
                    failed: failed.slice(0, 5).map((j) => ({
                        id: j.id,
                        data: j.data,
                        error: j.failedReason,
                    })),
                    active: active.slice(0, 5).map((j) => ({
                        id: j.id,
                        progress: j.progress(),
                    })),
                },
            };
        }

        return stats;
    }

    /**
     * Get queue health status
     */
    async getHealthStatus() {
        const stats = await this.getQueueStats();
        const health = {
            timestamp: new Date(),
            overall: 'healthy',
            queues: {},
        };

        for (const [queueName, queueStats] of Object.entries(stats)) {
            const { counts } = queueStats;
            const failureRate =
                counts.completed + counts.failed > 0
                    ? (counts.failed / (counts.completed + counts.failed)) * 100
                    : 0;

            let queueHealth = 'healthy';
            if (failureRate > 10) queueHealth = 'degraded';
            if (failureRate > 25) queueHealth = 'critical';
            if (counts.waiting > 10000) queueHealth = 'overloaded';

            health.queues[queueName] = {
                status: queueHealth,
                failureRate: failureRate.toFixed(2) + '%',
                stats: counts,
            };

            if (queueHealth !== 'healthy') {
                health.overall = 'degraded';
            }
        }

        return health;
    }

    /**
     * Get detailed job metrics
     */
    async getJobMetrics() {
        const metrics = {};

        for (const { name, queue } of this.queues) {
            const allJobs = await queue.getJobs(
                ['completed', 'failed', 'active', 'waiting'],
                0,
                -1
            );

            const processingTimes = [];
            const errorsByType = {};

            for (const job of allJobs) {
                if (job.completedTimestamp && job.createdAt) {
                    const time = job.completedTimestamp - job.createdAt;
                    processingTimes.push(time);
                }

                if (job.failedReason) {
                    const errorType = job.failedReason.split(':')[0];
                    errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
                }
            }

            const avgProcessingTime =
                processingTimes.length > 0
                    ? (
                          processingTimes.reduce((a, b) => a + b, 0) /
                          processingTimes.length
                      ).toFixed(2)
                    : 0;

            metrics[name] = {
                totalJobsProcessed: allJobs.length,
                averageProcessingTimeMs: avgProcessingTime,
                errorBreakdown: errorsByType,
            };
        }

        return metrics;
    }

    /**
     * Clear failed/completed jobs older than specified days
     */
    async cleanupOldJobs(daysOld = 7) {
        const results = {};
        const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

        for (const { name, queue } of this.queues) {
            const completed = await queue.getJobs(['completed'], 0, -1);
            const failed = await queue.getJobs(['failed'], 0, -1);

            let removedCount = 0;

            for (const job of [...completed, ...failed]) {
                if (job.completedTimestamp && job.completedTimestamp < cutoffTime) {
                    await job.remove();
                    removedCount++;
                }
            }

            results[name] = { removedCount };
        }

        return results;
    }

    /**
     * Get queue summary for dashboard
     */
    async getSummary() {
        const [stats, health, metrics] = await Promise.all([
            this.getQueueStats(),
            this.getHealthStatus(),
            this.getJobMetrics(),
        ]);

        return {
            timestamp: new Date(),
            health: health.overall,
            stats,
            metrics,
        };
    }
}

module.exports = QueueMonitor;
