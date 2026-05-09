## BullMQ Queue Architecture for Dropty API

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATIONS                         │
│  (Web, Mobile, Admin Dashboard)                                     │
└──────────────────┬──────────────────┬──────────────────┬────────────┘
                   │                  │                  │
                   ▼                  ▼                  ▼
         ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
         │ POST /notif  │    │ POST /message│   │ GET /job/:id │
         │   endpoint   │    │   endpoint   │   │   endpoint   │
         └──────┬───────┘    └──────┬───────┘   └──────┬───────┘
                │                   │                   │
                └───────────────────┼───────────────────┘
                                    ▼
              ┌──────────────────────────────────────────┐
              │         EXPRESS API ROUTES               │
              │    (/test-queue/message, etc)            │
              └──────────────────┬───────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │ Validation           │ Input Check          │
          │ Batch Splitting      │ Error Handling       │
          └──────────┬───────────┼──────────┬───────────┘
                     │           │          │
                     ▼           ▼          ▼
        ┌─────────────────────────────────────────┐
        │  QUEUE JOBS (via BullMQ)               │
        │  {jobId, name, data, options}          │
        └─────────────┬───────────────────────────┘
                      │
                      ▼
        ╔═════════════════════════════════════════╗
        ║     REDIS DATA STORE (Port 6379)        ║
        ║  • Job Queue Storage                    ║
        ║  • Job State & Progress                 ║
        ║  • Job Results (24hr retention)         ║
        ║  • Failed Jobs (7-day retention)        ║
        ╚═════════════┬───────────────────────────╝
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Notif Queue  │ │ Message Queue│ │ State Store  │
│(name:{notif})│ │ (name:{msg}) │ │ & Locks      │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
    ┌─────────────────────┐    ┌─────────────────────┐
    │ Notification Worker │    │  Message Worker     │
    │ (Concurrency: 10)   │    │ (Concurrency: 5)    │
    └──────┬──────────────┘    └────────┬────────────┘
           │                           │
           ├─ Process Job             ├─ Load Job
           ├─ Validate Data           ├─ Split Recipients
           ├─ Send Notification       ├─ Parallel Batches
           ├─ Update Progress         ├─ Progress Tracking
           ├─ Store Result            ├─ Error Handling
           └─ Emit Events             └─ Store Result
                 │                          │
                 └──────────────┬───────────┘
                                │
                    ┌───────────┴────────────┐
                    │                       │
                    ▼                       ▼
            (Success/Failure)     Events: completed, failed
                    │                       │
                    └───────────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              Job Result Stored        Client Polling
              in Redis (TTL)           GET /job/:id
```

---

### Workflow: Sending 1500 Bulk Messages

```
Request: POST /message with 1500 recipients
    │
    ▼
Route Handler
    │
    ├─ Validate recipients, messageBody
    │
    ├─ Check if 1500 > 500 (MAX_RECIPIENTS_PER_JOB)
    │
    ├─ YES → Split into batches:
    │   ├─ Job-1: recipients[0-499]   (500 recipients)
    │   ├─ Job-2: recipients[500-999] (500 recipients)
    │   └─ Job-3: recipients[1000-1499] (500 recipients)
    │
    ├─ Add all 3 jobs to messageQueue
    │
    └─ Return batchId and jobIds to client
         Response:
         {
           "batchId": "batch-1708345600000-xyz",
           "jobIds": ["job-1", "job-2", "job-3"],
           "totalRecipients": 1500
         }

━━━━━━━━━━━━━━━━━━━━━━ (ASYNC - Background Processing) ━━━━━━━━━━━━━━━

Message Worker (Pool of 5 concurrent workers)
    │
    ├─ [Worker-1] Processes Job-1
    │   ├─ Load 500 recipients
    │   ├─ Split into batches of 10
    │   ├─ Send batches in parallel
    │   ├─ Update progress: 10% → 50% → 100%
    │   └─ Return: { successful: 500, failed: 0 }
    │
    ├─ [Worker-2] Processes Job-2 (same flow)
    │
    ├─ [Worker-3] Processes Job-3 (same flow)
    │
    └─ [Worker-4,5] Idle or processing other jobs

Final Results stored in Redis:
    Job-1: { state: 'completed', result: {...} }
    Job-2: { state: 'completed', result: {...} }
    Job-3: { state: 'completed', result: {...} }

Client polls for batch status: GET /batch/batch-xyz
    Response:
    {
      "stats": {
        "total": 3,
        "completed": 3,
        "failed": 0
      }
    }
```

---

### Queue State Transitions

```
Job Lifecycle:

    CREATED (new job added)
        │
        ▼
    WAITING (in queue, waiting for worker)
        │
        ├─ Retry Logic Active
        │
        ▼
    ACTIVE (worker processing)
        │
        ├─ Progress: 0% → 100%
        │
        ├─ SUCCESS → COMPLETED ──┐
        │                         │
        ├─ ERROR ─→ RETRY ───────┤
        │   (up to 3 attempts)    │
        │                         │
        └─ FAILED (max retries) ─┤
                                  │
         Results stored in        │
         Redis for 24h/7d         │
                                  ▼
                            REMOVED
```

---

### Data Flow: Job Object

```
Request Payload:
┌────────────────────────┐
│ recipients: [...]      │
│ messageBody: "text"    │
└────────────────────────┘
         │
         ▼
BullMQ Job Object Created:
┌────────────────────────────────────┐
│ Job {                              │
│   id: 'job-123',                   │
│   name: 'send-bulk-message',       │
│   data: {                          │
│     recipients: [...],             │
│     messageBody: 'text',           │
│     batchId: 'batch-xyz',          │
│     batchNumber: 1,                │
│     totalBatches: 3,               │
│     createdAt: 2024-02-18T...      │
│   },                               │
│   opts: {                          │
│     attempts: 3,                   │
│     backoff: { ... },              │
│     priority: 5                    │
│   },                               │
│   progress: 0                      │
│ }                                  │
└────────────────────────────────────┘
         │
         ▼
Stored in Redis:
    Key: "queue:job:123"
    Value: Job object (JSON)
         │
         ▼
Worker Processes:
    Gets job from queue
    Executes job.processor()
    Updates progress
    Returns result
         │
         ▼
Result Stored:
┌────────────────────────────────────┐
│ Job Result {                       │
│   id: 'job-123',                   │
│   state: 'completed',              │
│   progress: 100,                   │
│   returnvalue: {                   │
│     successful: 500,               │
│     failed: 0,                     │
│     errors: []                     │
│   },                               │
│   completedTimestamp: 1708345820   │
│ }                                  │
└────────────────────────────────────┘
```

---

### Concurrency Model

```
Notification Queue (Concurrency: 10)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [Active] [Active] [Active] [Active] [Active]          │
│  Job-1    Job-2    Job-3    Job-4    Job-5             │
│    50%      75%      10%      40%      90%              │
│                                                          │
│  [Active] [Active] [Active] [Active] [Active]          │
│  Job-6    Job-7    Job-8    Job-9    Job-10            │
│    25%      60%      45%      20%      85%              │
│                                                          │
│  (Max 10 concurrent, next queue if >10)                │
│                                                          │
└──────────────────────────────────────────────────────────┘

Message Queue (Concurrency: 5)
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [Active] [Active] [Active] [Active] [Active]          │
│  Batch-1  Batch-2  Batch-3  Batch-4  Batch-5           │
│   500r     250r     1200r    100r     800r              │
│                                                          │
│  (Processing 500+250+1200+100+800 = 2850 recipients)   │
│  (At 10 recipients/sec per batch = ~285 sec total)     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Monitoring Architecture

```
Queue Monitor
    │
    ├─ getQueueStats()
    │   ├─ Read from Redis
    │   ├─ Count jobs by state
    │   └─ Return counts: waiting, active, completed, failed
    │
    ├─ getHealthStatus()
    │   ├─ Calculate failure rate
    │   ├─ Check queue depth
    │   └─ Return: healthy/degraded/critical
    │
    ├─ getJobMetrics()
    │   ├─ Analyze processing times
    │   ├─ Error breakdown by type
    │   └─ Calculate averages
    │
    └─ cleanupOldJobs()
        ├─ Find jobs > X days old
        ├─ Remove from Redis
        └─ Return count removed

Stats Display:
┌─────────────────────────────────┐
│ Health Status                   │
├─────────────────────────────────┤
│ Overall: healthy                │
│                                 │
│ Notification Queue:             │
│  • Waiting: 45                  │
│  • Active: 10                   │
│  • Completed: 1200              │
│  • Failed: 5                    │
│  • Failure Rate: 0.4%           │
│                                 │
│ Message Queue:                  │
│  • Waiting: 120                 │
│  • Active: 5                    │
│  • Completed: 450               │
│  • Failed: 2                    │
│  • Failure Rate: 0.4%           │
│                                 │
│ Avg Processing Time:            │
│  • Notification: 500ms          │
│  • Message: 3200ms (per batch)  │
└─────────────────────────────────┘
```

---

### Error Handling Flow

```
Job Execution
    │
    ▼
Try to Process
    │
    ├─ SUCCESS
    │   │
    │   ├─ Save result
    │   ├─ Emit 'completed' event
    │   └─ Update job state: COMPLETED
    │
    └─ ERROR
        │
        ├─ Check retry count
        │
        ├─ IF attempts < 3
        │   ├─ Calculate backoff delay
        │   ├─ Re-queue job
        │   └─ Exponential backoff: 1s → 2s → 4s
        │
        └─ IF attempts >= 3
            ├─ Save error reason
            ├─ Emit 'failed' event
            ├─ Update job state: FAILED
            └─ Keep in Redis for 7 days (debugging)
```

---

### API Response Flow

```
Client Request
    │
    ▼
POST /test-queue/message
    │
Response 1 (Immediate):
┌────────────────────────────────┐
│ {                              │
│   "status": true,              │
│   "batchId": "batch-xyz",      │
│   "jobIds": ["job-1", "job-2"],│
│   "data": {                    │
│     "totalRecipients": 1500,   │
│     "jobCount": 3              │
│   }                            │
│ }                              │
└────────────────────────────────┘
    │
    ▼ (Client polls)
GET /test-queue/batch/batch-xyz
    │
Response 2 (While processing):
┌────────────────────────────────┐
│ {                              │
│   "stats": {                   │
│     "total": 3,                │
│     "completed": 1,            │
│     "active": 2,               │
│     "waiting": 0,              │
│     "failed": 0                │
│   },                           │
│   "jobs": [                    │
│     {                          │
│       "id": "job-1",           │
│       "state": "completed",    │
│       "progress": 100          │
│     },                         │
│     {                          │
│       "id": "job-2",           │
│       "state": "active",       │
│       "progress": 65           │
│     }                          │
│   ]                            │
│ }                              │
└────────────────────────────────┘
    │
    ▼ (After all complete)
Response 3 (Final):
┌────────────────────────────────┐
│ {                              │
│   "stats": {                   │
│     "total": 3,                │
│     "completed": 3,            │
│     "active": 0,               │
│     "failed": 0                │
│   }                            │
│ }                              │
└────────────────────────────────┘
```

---

This architecture ensures:

- ✅ Scalable bulk processing
- ✅ Fault-tolerant job execution
- ✅ Observable progress tracking
- ✅ Predictable resource usage
- ✅ Easy monitoring and debugging
