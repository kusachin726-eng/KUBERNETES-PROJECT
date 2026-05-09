const NotificationService = require('./notification.service');

const CustomerNotificationController = {
    
    // Get All Notifications
    getAllNotifications: async (req, res, next) => {
        try {
            const result = await NotificationService.getAllNotifications({
                userId: req.user.id,
                query: req.query
            });

            return res.json({
                success: true,
                ...result
            });

        } catch (error) {
            next(error);
        }
    },

    // For single, All Delete & single Read Notification
    updateNotification: async (req, res, next) => {
        try {
            const { id, action } = req.query;

            await NotificationService.updateNotification({
                userId: req.user.id,
                notificationId: id,
                action
            });

            return res.json({
                success: true,
                message: "Notification action completed successfully"
            });

        } catch (error) {
            next(error);
        }
    },

};

module.exports = CustomerNotificationController;
