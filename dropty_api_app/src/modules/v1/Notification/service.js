const db = require("../../../data-access/sequelize/models");
const sendPushNotification = require('./pushnotification')
const { consoleLogger } = require('../../../config/logger');
const { Op } = require("sequelize");

const NotificationService = {

    generateNotification: async (option) => {
        try {
            const { notificationEnum, dynamicKeys, senderUserId, receiverUserId, receiverUserType, bookingId } = option;

            let defaultBodyMap = {
                BOOKING_CONFIRMED: "Booking #{bookingid} confirmed successfully.",
                BOOKING_CANCELLED: "Booking #{bookingid} cancelled successfully.",
                PROFILE_UPDATED: "Your profile has been updated successfully."
            };

            // 1. Fetch the Notification Template
            let notificationObject = await NotificationService.getNotificationByEnum({ notificationEnum });
           
            // if (!notificationObject) throw new Error("Notification template not found");
            if (!notificationObject) {
                notificationObject = await db.Notifications.create({
                    title: notificationEnum.replace(/_/g, " "),
                    body: defaultBodyMap[notificationEnum] || "You have a new notification.",
                    type: "PUSH",
                    notificationEnum,
                    delayTime: 0,
                    event: "booking",
                    referenceType: "booking"
                });
           }            

            // Generate Body
            const body = NotificationService.generateNotificationTitleBody(notificationObject.body, dynamicKeys);

            const scheduleTime = NotificationService.generateScheduleTime(notificationObject.delayTime);

            // 2. Fetch User with ALL valid devices
            const user = await db.Users.findOne({
                where: { id: receiverUserId, user_type: receiverUserType.toLowerCase() },
                include: [{
                    model: db.DeviceManage,
                    as: 'devices',
                    where: {
                        fcm_token: {
                            [Op.and]: [
                                { [Op.ne]: null },
                                { [Op.ne]: "" },
                                db.sequelize.where(
                                    db.sequelize.fn("length", db.sequelize.col("fcm_token")),
                                    { [Op.gt]: 100 }
                                )
                            ]
                        }
                    },
                    attributes: ['fcm_token', 'device_info', 'device_id'],
                    required: false
                }],
                attributes: ['id']
            });

            if (!user) {
                throw new Error("User not found");
            }

            if (!user.devices || user.devices.length === 0) {

                await db.NotificationLog.create({
                    notificationId: notificationObject.id,
                    receiverUserType: receiverUserType.toUpperCase(),
                    receiverUserId,
                    senderUserId,
                    title: notificationObject.title,
                    body,
                    status: 'FAILED',
                    notificationType: notificationObject.type || 'PUSH', 
                    notificationEnum: notificationObject.notificationEnum,
                    bookingId

                });

                return "User has no registered devices";
            }

           if (!user || !user.devices.length) {
                return {
                    totalUsers: 0,
                    totalDevices: 0,
                    successCount: 0,
                    failureCount: 0
                };
            }

            let totalUsers = 1;
            let totalDevices = user.devices.length;
            let scheduledCount = 0;


            // 3. Loop through each device associated with the user
            for (let device of user.devices) {
                const notificationPayload = {
                    notificationId: notificationObject.id,
                    // receiverUserType,
                    receiverUserType: receiverUserType.toUpperCase(),
                    receiverUserId,
                    senderUserId,
                    title: notificationObject.title,
                    body: body,
                    fcmToken: device.fcm_token,
                    deviceId: device.device_id,
                    deviceType: device.device_info,
                    scheduleTime,
                    notificationType: notificationObject.type || 'PUSH',
                    status: 'SCHEDULED',
                    notificationEnum: notificationObject.notificationEnum,
                    event: notificationObject.event,
                    type: notificationObject.referenceType || 'Booking',
                    bookingId
                };

                const savedLog = await db.NotificationLog.create(notificationPayload);
                scheduledCount++;

                // 4. Scheduling Logic
                const delay = new Date(scheduleTime).getTime() - Date.now();

                // Safety: If delay is in the past or very small, send immediately
                const actualDelay = delay > 0 ? delay : 0;

                setTimeout(async () => {
                    try {
                        const response = await NotificationService.sendNotification({
                            ...notificationPayload,
                            id: savedLog.id
                        });

                        // await db.NotificationLog.update(
                        //     { status: 'SENT', firebaseResponse: JSON.stringify(response) },
                        //     { where: { id: savedLog.id } }
                        // );
                    } catch (sendError) {
                        await db.NotificationLog.update(
                            { status: 'FAILED', errorMessage: sendError.message },
                            { where: { id: savedLog.id } }
                        );
                    }
                }, actualDelay);
            }
            return {
                totalUsers,
                totalDevices,
                // scheduledCount,
                message: "Notification scheduled successfully"
            };

        } catch (error) {
            consoleLogger.error(`Error in notification: ${error}`);
            // throw error; // Let the caller know it failed
        }
    },

    generateNotificationTitleBody: (body, dynamicKeys) => {
        try {
            if (!body || typeof body !== "string") {
                throw new Error("Invalid body: Must be a string");
            }
            if (!dynamicKeys || typeof dynamicKeys !== "object") {
                throw new Error("Invalid dynamicKeys: Must be an object");
            }
            return body.replace(/\{([^\}]+)\}/g, (match, key) => {
                const formattedKey = key.toLowerCase();
                return formattedKey in dynamicKeys ? dynamicKeys[formattedKey] : match;
            });

        } catch (error) {
            throw error;
        }
    },

    generateScheduleTime: (delayTime) => {
        try {
            if (typeof delayTime !== "number" || isNaN(delayTime)) {
                throw new Error("Invalid delayTime: Must be a number.");
            }
            const now = new Date();
            now.setHours(now.getHours() + delayTime);
            return now;

        } catch (error) {
            throw error;
        }
    },

    sendNotification: async (notification) => {
        try {
            const message = {
                token: notification.fcmToken,
                notification: {
                    title: notification.title,  //   null,   // set null to avoid double notification in android app
                    body: notification.body, // null 
                },
                android: {
                    notification: {
                        channel_id: "Dropty",
                        sound: "default"
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            channel_id: "Dropty",
                            sound: "default"
                        }
                    }
                },
                data: {
                    bookingId: String(notification.bookingId || ""), // Ensure it's a string
                    title: notification.title,
                    body: notification.body,
                    notificationEnum: String(notification.notificationEnum), // Ensure it's a string
                    id: String(notification.id) // Ensure it's a string
                },
            };

            // adding sound for NEW_BOOKING_RECEIVED notification
            if (notification.notificationEnum == 'NEW_BOOKING_RECEIVED' || notification.notificationEnum == 'BOOKING_RESCHEDULED_BY_CUSTOMER') {
                message.android.notification = {
                    channel_id: "Dropty with sound",
                    sound: "tune"
                }
                message.apns.payload.aps = {
                    channel_id: "Dropty with sound",
                    sound: "tune.wav",
                }
            }

            const response = await sendPushNotification(message, notification.receiverUserType)
            if (!response) {
                throw new Error("Empty Firebase response");
            }
            // update in logs

            // REMOVE invalid tokens after sending
            if (response?.errorInfo?.code || response?.responses) {
                const tokens = [notification.fcmToken]; // single token in this function
                const responses = response.responses || [response];

                for (let i = 0; i < responses.length; i++) {
                    const resp = responses[i];
                    const failedToken = tokens[i];

                    if (!resp.success) {
                        const errorCode = resp.error?.code;
                        if (
                            errorCode === 'messaging/registration-token-not-registered' ||
                            errorCode === 'messaging/invalid-registration-token'
                        ) {
                            await db.DeviceManage.destroy({ where: { fcm_token: failedToken } });
                        }
                    }
                }
            }

            // Update NotificationLog
        
            await db.NotificationLog.update(
                    { status: 'SENT', firebaseResponse: JSON.stringify(response) },
                    { where: { id: notification.id } }
            );
            return response;
        } catch (error) {
            console.log(error)
            consoleLogger.error("FCM send error:", error.errorInfo?.message || error.message);

            // Update log as FAILED
            await db.NotificationLog.update(
                { status: 'FAILED', errorMessage: error.message },
                { where: { id: notification.id } }
            );

            return null;
        }
    },

    getDeviceDetails: async (condition) => {
        try {
            return await db.DeviceManage.findOne({
                where: condition,
                attributes: ['deviceToken', 'deviceInfo', 'deviceId'],
            })
        } catch (error) {
            throw error;
        }
    },

    createNotificationService: async (notificationData) => {
        try {
            await db.Notifications.bulkCreate(notificationData);
        } catch (error) {
            throw error;
        }
    },

    getNotificationByEnum: async (condition) => {
        try {
            return await db.Notifications.findOne({
                where: condition
            })
        } catch (error) {
            throw error;
        }
    },

}

module.exports = NotificationService;

