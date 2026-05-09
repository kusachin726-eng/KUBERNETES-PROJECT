const db = require("../../../../data-access/sequelize/models");


const CustomerNotificationService = {   

    // Get All Notifications
    getAllNotifications: async ({ userId, query }) => {

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            receiverUserId: userId,
            status: "SENT"
        };

        if (query.readStatus) {
            whereClause.readStatus = query.readStatus;
        }

        if (query.type) {
            whereClause.type = query.type;
        }

        const { count, rows } = await db.NotificationLog.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            data: rows
        };
    },

    // For single, All Delete & single Read Notification
    updateNotification: async ({ userId, notificationId, action }) => {

        if (!action || !["read", "delete"].includes(action)) {
            throw new Error("Invalid action type");
        }

        // READ LOGIC
        if (action === "read") {
            // Read All
            if (!notificationId || notificationId === "all") {
                await db.NotificationLog.update(
                    { readStatus: "READ" },
                    {
                        where: { receiverUserId: userId },
                        status: "SENT"
                    }
                );
                return;
            }
            // Read Single
            const [updated] = await db.NotificationLog.update(
                { readStatus: "READ" },
                {
                    where: {
                        id: notificationId,
                        receiverUserId: userId,
                        status: "SENT"
                    }
                }
            );
            if (!updated) {
                throw new Error("Notification not found");
            }
            return;
        }

        // DELETE LOGIC
        if (action === "delete") {
            // Delete All
            if (!notificationId || notificationId === "all") {
                await db.NotificationLog.destroy({
                    where: { receiverUserId: userId }
                });
                return;
            }
            // Delete Single
            const deleted = await db.NotificationLog.destroy({
                where: {
                    id: notificationId,
                    receiverUserId: userId
                }
            });
            if (!deleted) {
                throw new Error("Notification not found");
            }
            return;
        }
    },

}

module.exports = CustomerNotificationService;

