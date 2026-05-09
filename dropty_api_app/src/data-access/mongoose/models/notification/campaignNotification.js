const mongoose = require('mongoose');

const CampaignNotificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
    },
    audienceType:{
        type: String,
        enum: ['customer', 'expert'],
        required: true
    },
    body: {
        type: String,
        required: true
    },
    customerIds: {
        type: [String],
        default: []
    },
    deliveryModes: {
        type: [String],
        enum: ['push', 'in-app', 'sms', 'whatsapp', 'email'],
        default: ['PUSH']
    },
    event: {
        type: String,
        enum: [
            "Reminder", "Requested", "Cancelled", "Completed", "Accepted", "Rejected", "Chat",
            "Discount Offers", "Seasonal Offers", "Maintenance Alerts", "Referral", "New Arrival", "Festive Special","custom"
        ],
        required: true
    },
    expertIds: {
        type: [String],
        default: []
    },
    scheduleType: {
        type: String,
        enum: ['now', 'later'],
        required: true
    },
    scheduledDateTime: {
        type: Date,
        required: true
    },
    senderUserId: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum:['campaign'],
        default: 'campaign'
    },
    // removed according to new notification module dispatcher-worker module
        batchSize: {
            type: Number,
            default: 100
        },
        notificationEnum: {
            type: String,
            required: true
        },
        soundType: {
            type: String,
            enum: ['default', 'custom'],
            default: 'default'
        },
        queueJobId: {
            type: String,
            default: null
        }, 
        additionalData: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }, 
        // error: {
        //     type: String,
        //     default: null
        // },
        // startedSendingAt: {
        //     type: Date,
        //     default: null
        // },
        totalQueued:{
            type: Number,
            default: 0
        },

    // removed according to new notification module dispatcher-worker module
    
    status: {
        type: String,
        enum: ['PENDING','QUEUED','PROCESSED','PROCESSING', 'COMPLETED', 'FAILED','CANCELLED'],
        default: 'PENDING'
    },
    statusLog: [{
      status: {
        type: String,
        enum: ['PENDING','QUEUED','PROCESSED','PROCESSING', 'COMPLETED', 'FAILED','CANCELLED'],
      },
      datetime: {
        type: Date,
        default: Date.now
      }
    }],
    totalSent:{
        type: Number,
        default: 0
    },
    totalFailed:{
        type: Number,
        default: 0
    },
    filters: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // new fields for dispacther-worker notification module
    // ✅ Hybrid batching fields
    // totalRecipients: { type: Number, default: 0 },s
    totalBatches: { type: Number, default: 0 },
    completedBatches: { type: Number, default: 0 },
    cancelRequested: { type: Boolean, default: false },
    pendingBatches: { type: Number, default: 0 },
    // batchDetails: [{
    //   batchNumber: {
    //     type: Number,
    //     required: true
    //   },
    //   jobId: {
    //     type: String,
    //     required: true
    //   },
    //   status: {
    //     type: String,
    //     enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    //     default: 'QUEUED'
    //   },
    //   totalNotifications: {
    //     type: Number,
    //     default: 0
    //   },
    //   successCount: {
    //     type: Number,
    //     default: 0
    //   },
    //   failedCount: {
    //     type: Number,
    //     default: 0
    //   },
    //   startedAt: {
    //     type: Date,
    //     default: null
    //   },
    //   completedAt: {
    //     type: Date,
    //     default: null
    //   },
    //   error: {
    //     type: String,
    //     default: null
    //   }
    // }],

  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

// ✅ Indexes for fast queries
CampaignNotificationSchema.index({ scheduledDateTime: 1, status: 1 });
CampaignNotificationSchema.index({ notificationId: 1 });

module.exports = mongoose.model('CampaignNotification', CampaignNotificationSchema);