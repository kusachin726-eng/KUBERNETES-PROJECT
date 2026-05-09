const db = require("../../../../data-access/sequelize/models");
const { getCustomerApp } = require('../../../../config/firebase');
const { Op } = require("sequelize");

const AdminNotificationService = {   

    // bulk notification
    sendPushToUsers: async ({ userIds, title, body }) => {

        const customerApp = getCustomerApp();

        try {

            const users = await db.Users.findAll({
                where: {
                    id: userIds,
                    user_type: 'customer'
                },
                include: [{
                    model: db.DeviceManage,
                    as: 'devices',
                    where: {
                        fcm_token: {
                            [Op.and]: [
                                { [Op.ne]: null },
                                { [Op.ne]: '' },
                                db.sequelize.where(
                                    db.sequelize.fn('length', db.sequelize.col('fcm_token')),
                                    { [Op.gt]: 100 }
                                )
                            ]
                        }
                    },
                    attributes: ['fcm_token', 'device_id', 'device_info'],
                    required: true
                }],
                attributes: ['id']
            });

            if (!users.length) {
                return { totalUsers: 0, totalDevices: 0, successCount: 0, failureCount: 0 };
            }

            // Create master notification
            const notificationMaster = await db.Notifications.create({
                title,
                body,
                type: 'PUSH',
                notificationEnum: 'CUSTOM_USER_PUSH',
                event: 'Custom'
            });

            let tokens = [];
            let logsToCreate = [];

            for (let user of users) {
                for (let device of user.devices) {

                    tokens.push(device.fcm_token);

                    logsToCreate.push({
                        notificationId: notificationMaster.id,
                        receiverUserType: 'CUSTOMER',
                        receiverUserId: user.id,
                        title,
                        body,
                        fcmToken: device.fcm_token,
                        deviceId: device.device_id,
                        deviceType: device.device_info,
                        notificationType: 'PUSH',
                        status: 'QUEUED',
                        notificationEnum: 'CUSTOM_USER_PUSH'
                    });
                }
            }

            const createdLogs = await db.NotificationLog.bulkCreate(logsToCreate);

            const chunkSize = 500;
            let successCount = 0;
            let failureCount = 0;

            let successIds = [];
            let failedIds = [];
            let invalidTokens = [];

            for (let i = 0; i < tokens.length; i += chunkSize) {

                const chunk = tokens.slice(i, i + chunkSize);
                const chunkLogs = createdLogs.slice(i, i + chunkSize);

                const message = {
                    tokens: chunk,
                    notification: { title, body }
                };

                const response = await customerApp
                    .messaging()
                    .sendEachForMulticast(message);

                for (let j = 0; j < response.responses.length; j++) {

                    const resp = response.responses[j];
                    const logId = chunkLogs[j].id;
                    const token = chunk[j];

                    if (resp.success) {

                        successIds.push(logId);

                    } else {

                        failedIds.push(logId);

                        const errorCode = resp.error?.code;

                        if (
                            errorCode === 'messaging/registration-token-not-registered' ||
                            errorCode === 'messaging/invalid-registration-token'
                        ) {
                            invalidTokens.push(token);
                        }
                    }
                }

                successCount += response.successCount;
                failureCount += response.failureCount;
            }

            // Bulk update statuses
            if (successIds.length) {
                await db.NotificationLog.update(
                    { status: 'SENT' },
                    { where: { id: successIds } }
                );
            }

            if (failedIds.length) {
                await db.NotificationLog.update(
                    { status: 'FAILED' },
                    { where: { id: failedIds } }
                );
            }

            // Remove invalid tokens
            if (invalidTokens.length) {
                await db.DeviceManage.destroy({
                    where: {
                        fcm_token: invalidTokens
                    }
                });
            }

            return {
                totalUsers: users.length,
                totalDevices: tokens.length,
                successCount,
                failureCount
            };

        } catch (error) {
            throw error;
        }
    },   

};

module.exports = AdminNotificationService;
