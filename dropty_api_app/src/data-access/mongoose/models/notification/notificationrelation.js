const mongoose = require('mongoose');

const NotificationRelationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
    },
    receiverUserType: {
      type: String,
      enum: ['CUSTOMER', 'PROVIDER'],
    },
    notificationEnum: {
      type:String,
    },
    receiverUserId: {
      type: String,
    },
    senderUserId: {
      type: String,
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    event: {
      type: String,
      enum: [
        "Reminder", "Requested", "Cancelled", "Completed", "Accepted", "Rejected", "Chat", "Credit", "Debit",
        "Discount Offers", "Seasonal Offers", "Maintenance Alerts", "Referral", "New Arrival", "Festive Special","custom"
      ]
    },
    fcmToken: {
      type: String,
    },
    deviceId:{
      type: String,
    },
    scheduleTime: {
      type: Date,
    },
    deviceType: {
      type: String,
      enum: ['android', 'ios'],
    },
    notificationType: {
      type: String,
      enum: ['PUSH', 'INAPP', 'SMS', 'EMAIL'],
      required: true,
    },
    type: {
      type: String,
      enum: ['Booking','campaign','Wallet','Subscription'],
      default: "Booking"
    },
    bookingId: {
      type: String,
      default: null
    },
    firebaseResponse: {
      type: String,
    },
    // New field for storing error messages
    errorMessage: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['SENT', 'CANCEL', 'SCHEDULED', 'INACTIVE','QUEUED', 'FAILED'],
      required: true,
    },
    readStatus: {
      type: String,
      enum: ['READ', 'UNREAD'],
      default: 'UNREAD',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

NotificationRelationSchema.index({receiverUserId: 1, receiverUserType: 1, createdAt: -1 });
NotificationRelationSchema.index({ deviceId: 1, receiverUserId: 1, receiverUserType: 1, createdAt: -1 });
// NotificationRelationSchema.index({ notificationId: 1, status: 1 });
// NotificationRelationSchema.index({ receiverUserId: 1, deviceId: 1 });
module.exports = mongoose.model('NotificationRelation', NotificationRelationSchema);