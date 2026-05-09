const AdminNotificationService = require('./notification.service');

const AdminNotificationController = {

    // send Bulk notification
    sendNotificationToUsers : async (req, res, next) => {
        try {
            const { userIds, title, body } = req.body;

            const result = await AdminNotificationService.sendPushToUsers({
                userIds,
                title,
                body
            });

            res.json({
                success: true,
                message: "Notification sent",
                data: result
            });

        } catch (error) {
            next(error);
        }
    },

}
module.exports = AdminNotificationController;
