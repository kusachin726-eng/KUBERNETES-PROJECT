const NotificationService = require('./service');

const NotificationEvents = {

    bookingConfirmed: async (bookingId, userId) => {
        return NotificationService.generateNotification({
            notificationEnum: 'BOOKING_CONFIRMED',
            dynamicKeys: { bookingid: bookingId },
            senderUserId: userId,
            receiverUserId: userId,
            receiverUserType: 'CUSTOMER',
            bookingId
        });
    },

    bookingCancelled: async (bookingId, userId) => {
        return NotificationService.generateNotification({
            notificationEnum: 'BOOKING_CANCELLED',
            dynamicKeys: { bookingid: bookingId },
            senderUserId: userId,
            receiverUserId: userId,
            receiverUserType: 'CUSTOMER',
            bookingId
        });
    },

    bookingRequested: async (bookingId, userId) => {
        return NotificationService.generateNotification({
            notificationEnum: 'BOOKING_REQUESTED',
            dynamicKeys: { bookingid: bookingId },
            senderUserId: userId,
            receiverUserId: userId,
            receiverUserType: 'CUSTOMER',
            bookingId
        });
    },

};

module.exports = NotificationEvents;
