const mongoose = require('mongoose');

const ScheduledNotificationSchema = new mongoose.Schema(
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
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    queueJobId: {
        type: String,
        default: null
    },  
    error: {
        type: String,
        default: null
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

module.exports = mongoose.model('ScheduledNotification', ScheduledNotificationSchema);