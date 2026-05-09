# BullMQ + Redis Queue Integration - Best Practices Guide

## 📌 Overview

Your Dropty API now has a production-ready queue system for handling bulk notifications and messages. This guide documents the improvements and best practices implemented.

---

## ✅ What Was Improved

### 1. **Worker Concurrency Control** (Critical)

```javascript
// BEFORE: No concurrency limit
const notificationWorker = new Worker("notification", handler, { connection });

// AFTER: Controlled concurrency
const notificationWorker = new Worker("notification", handler, {
  connection,
  concurrency: 10, // Max 10 jobs in parallel
});
```

**Why**: Prevents system overload, controls memory usage, and ensures graceful degradation.

---

### 2. **Bulk Job Splitting** (Critical for Large Lists)

```javascript
// BEFORE: Single job for ALL recipients (could be 1M+)
await messageQueue.add('send-message', { recipients: [1M items] });

// AFTER: Automatically split into manageable chunks
const MAX_RECIPIENTS_PER_JOB = 500;
if (recipients.length > MAX_RECIPIENTS_PER_JOB) {
    // Split into multiple jobs, each with 500 recipients
}
```

**Why**: Prevents timeout, memory overflow, and enables parallel processing.

---

### 3. **Progress Tracking** (UX Critical)

```javascript
// Inside worker:
await job.updateProgress(45); // Update progress to 45%

// Client can poll:
GET /test-queue/job/:jobId
// Returns: { progress: 45, state: 'active', ... }
```

**Why**: Users can see real-time progress for long-running operations.

---

### 4. **Proper Error Handling** (Reliability)

```javascript
// BEFORE: Generic error throwing
throw error;

// AFTER: Detailed error tracking
return {
    status: 'failed',
    error: error.message,
    failedRecipients: [...],
    successfulRecipients: [...],
};
```

**Why**: Enables partial success tracking and better debugging.

---

### 5. **Input Validation** (Security & Stability)

```javascript
// Validates:
✓ Required fields presence
✓ Data type correctness
✓ Enum values (email|push|sms)
✓ Array non-empty check
✓ Reasonable size limits
```

---

### 6. **Job Status Endpoints** (Observability)

#### Get Single Job Status

```bash
GET /test-queue/job/abc-123

Response:
{
  "id": "abc-123",
  "state": "active",
  "progress": 65,
  "result": { ... }
}
```

#### Get Batch Status

```bash
GET /test-queue/batch/batch-1708345600000-xyz

Response:
{
  "stats": {
    "total": 5,
    "completed": 2,
    "active": 2,
    "failed": 1
  },
  "jobs": [...]
}
```

---

### 7. **Queue Monitoring Utility**

```javascript
const QueueMonitor = require('./utils/queueMonitor');
const monitor = new QueueMonitor();

// Get comprehensive stats
const stats = await monitor.getQueueStats();
const health = await monitor.getHealthStatus();

// Results:
{
  "overall": "healthy",
  "queues": {
    "notification": {
      "status": "healthy",
      "failureRate": "2.5%",
      "stats": { waiting: 45, active: 3, completed: 1200, failed: 32 }
    }
  }
}
```

### 8. **Redis Cluster Compatibility** (Critical for Azure Redis)

```javascript
// BEFORE: Standard queue name (fails on Redis Cluster due to CROSSSLOT)
const queue = new Queue("message", { connection });

// AFTER: Using Hash Tags (ensures all keys for a queue hash to the same slot)
const queue = new Queue("{message}", { connection });
```

**Why**: Ensures that all internal Redis keys for a specific queue (wait, active, completed, etc.) are stored in the same hash slot, preventing `CROSSSLOT` errors in clustered environments.

---

## 🚀 Usage Examples

### Send Bulk Messages

```bash
POST /api/v1/test-queue/message
Content-Type: application/json

{
  "recipients": ["user1@email.com", "user2@email.com", ...],
  "messageBody": "Hello everyone!"
}

Response:
{
  "status": true,
  "batchId": "batch-1708345600000-abc123",
  "jobIds": ["job-1", "job-2"], // If split
  "data": {
    "totalRecipients": 1500,
    "jobCount": 3,
    "recipientsPerJob": 500
  }
}
```

### Send Single Notification

```bash
POST /api/v1/test-queue/notification
Content-Type: application/json

{
  "type": "email",
  "recipient": "user@example.com",
  "content": "Your booking confirmation",
  "userId": "user-123"
}
```

### Track Job Progress

```bash
GET /api/v1/test-queue/job/job-abc-123

# Client-side (poll every 2 seconds):
async function trackJob(jobId) {
  const response = await fetch(`/api/v1/test-queue/job/${jobId}`);
  const { job } = await response.json();

  updateProgressBar(job.progress); // 0-100

  if (job.state === 'completed' || job.state === 'failed') {
    clearInterval(pollInterval);
  }
}
```

---

## 🔧 Configuration Parameters

### Queue Options (src/config/queue.js)

```javascript
defaultQueueOptions = {
  defaultJobOptions: {
    attempts: 3, // Retry 3 times on failure
    backoff: {
      type: "exponential", // Retry delay grows exponentially
      delay: 1000, // Start with 1s delay
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000, // Keep last 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days (debugging)
      count: 5000,
    },
  },
};
```

### Worker Concurrency

```javascript
// Notification Worker: 10 concurrent jobs
// Message Worker: 5 concurrent jobs
// Adjust based on your server capacity
```

### Bulk Split Threshold

```javascript
MAX_RECIPIENTS_PER_JOB = 500; // Adjust based on memory/timeout constraints
```

---

## 📊 Monitoring & Health Checks

### Queue Health Status

```javascript
const monitor = new QueueMonitor();
const health = await monitor.getHealthStatus();

// Health levels:
// "healthy"   → <10% failure rate, <10k waiting jobs
// "degraded"  → 10-25% failure rate or >10k waiting
// "critical"  → >25% failure rate
// "overloaded" → >10k waiting jobs
```

### Performance Metrics

```javascript
const metrics = await monitor.getJobMetrics();

// Returns:
{
  "notification": {
    "totalJobsProcessed": 15420,
    "averageProcessingTimeMs": "234.56",
    "errorBreakdown": {
      "InvalidEmailError": 12,
      "TimeoutError": 5
    }
  }
}
```

---

## ⚠️ Common Pitfalls & Solutions

### Pitfall 1: Memory Overload with Large Recipient Lists

**Problem**: Trying to send to 100k+ recipients in one job

```javascript
// BAD ❌
await messageQueue.add('msg', { recipients: [100k items] });

// GOOD ✅
// Automatically splits into chunks of 500
```

### Pitfall 2: No Job Status Tracking

**Problem**: Client doesn't know when bulk operation finishes

```javascript
// BAD ❌
// Just return jobId, user has to guess when done

// GOOD ✅
// Poll the status endpoint
GET /test-queue/job/:jobId
```

### Pitfall 3: Worker Crashes from Overload

**Problem**: No concurrency limit, worker gets overwhelmed

```javascript
// BAD ❌
new Worker("queue", handler, { connection }); // Process unlimited

// GOOD ✅
new Worker("queue", handler, { connection, concurrency: 5 });
```

### Pitfall 4: Lost Job Data on Redis Restart

**Problem**: No persistence strategy

```javascript
// Solution: Configure Redis persistence
# In redis.conf or docker-compose:
- "save": "900 1" # Save if 1 change in 900s
- "appendonly": "yes" # AOF persistence
```

### Pitfall 5: No Error Recovery

**Problem**: Single bad recipient crashes entire batch

```javascript
// BEFORE: Entire job fails if one recipient fails
for (const recipient of recipients) {
  await sendEmail(recipient); // If this throws, entire job fails
}

// AFTER: Track errors per recipient
await Promise.allSettled(recipients.map((r) => sendEmail(r)));
// Job completes with partial success info
```

---

## 🔒 Security Considerations

### 1. **Validate All Input**

```javascript
✓ Check required fields
✓ Validate data types
✓ Sanitize email/phone formats
✓ Rate limit job submissions
✓ Enforce payload size limits
```

### 2. **Protect Sensitive Data**

```javascript
// Don't log PII in job data
// Bad: { email: "user@example.com", password: "secret" }

// Good: { userId: "user-123", notificationType: "email" }
```

### 3. **Authenticate Queue Operations**

```javascript
// Protect all queue endpoints with JWT/RBAC
router.post("/message", authMiddleware, rbacMiddleware, handler);
```

---

## 📈 Scaling Recommendations

### For High Volume (10k+ jobs/day)

1. **Increase worker concurrency** (carefully monitor CPU/memory)
2. **Use multiple worker instances** (distributed workers)
3. **Implement queue prioritization**

```javascript
// High priority notifications
await notificationQueue.add(jobData, { priority: 1 }); // Process first

// Low priority bulk messages
await messageQueue.add(jobData, { priority: 50 }); // Process last
```

### For Distributed Setup

```javascript
// Worker 1 (Notifications)
new Worker("notification", handler, { connection, concurrency: 10 });

// Worker 2 (Messages) - can run on different server
new Worker("message", handler, { connection, concurrency: 5 });

// Both share same Redis instance
```

---

## 🧪 Testing Queue Integration

### Test Bulk Message Job

```bash
curl -X POST http://localhost:3005/api/v1/test-queue/message \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["test1@example.com", "test2@example.com"],
    "messageBody": "Test message"
  }'
```

### Check Job Status

```bash
curl http://localhost:3005/api/v1/test-queue/job/job-id-here
```

### Monitor Queue Health

```bash
# In your Node.js code or API endpoint
const QueueMonitor = require('./utils/queueMonitor');
const monitor = new QueueMonitor();
const summary = await monitor.getSummary();
console.log(summary);
```

---

## 📝 Next Steps

1. **Implement actual sending logic** (replace console.log with real Email/SMS APIs)
2. **Add database persistence** for job results
3. **Set up Redis persistence** for production
4. **Create monitoring dashboard** using queue metrics
5. **Implement distributed workers** for horizontal scaling
6. **Add circuit breaker pattern** for external API calls
7. **Create job retry strategies** based on error types

---

## 📚 References

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Best Practices](https://redis.io/docs/management/persistence/)
- [Queue Patterns](https://blog.logrocket.com/how-to-build-batch-processing-queue-node-js/)
