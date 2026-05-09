const db = require("../../../../data-access/sequelize/models");
const AppError = require("../../../../utils/errorHandler/appError");

class DamageBaggageReportService {
    /**
     * Create a new damage baggage report   
     */
    async createDamageReport(bookingId, customerId, reportData) {
        try {
            // Verify booking exists and belongs to customer
            console.log("Verifying booking for damage report creation:", { bookingId, customerId });
            const booking = await db.Bookings.findOne({
                where: { id: bookingId, passengerId: customerId }
            });
console.log("Verifying booking for damage report creation:", { bookingId, customerId });
            if (!booking) {
                throw new AppError("Booking not found or does not belong to this customer", 404);
            }

            // Create damage report
            const damageReport = await db.DamageBaggageReport.create({
                bookingId,
                customerId,
                damageType: reportData.damageType || 'baggage',
                baggageDescription: reportData.baggageDescription,
                damageDescription: reportData.damageDescription,
                severity: reportData.severity,
                message: reportData.message,
                status: 'reported'
            });

            // Add images if provided
            if (reportData.images && reportData.images.length > 0) {
                const images = reportData.images.map(url => ({
                    damageReportId: damageReport.id,
                    imageUrl: url,
                    type: 'initial-report'
                }));
                await db.DamageReportImage.bulkCreate(images);
            }

            // Fetch complete report with images
            return await this.getDamageReportById(damageReport.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get damage report by ID with all details
     */
    async getDamageReportById(reportId) {
        try {
            const report = await db.DamageBaggageReport.findOne({
                where: { id: reportId },
                include: [
                    //{ model: db.Bookings, as: 'booking', attributes: ['id'] },
                    //{ model: db.Users, as: 'customer', attributes: ['id', 'mobile_number', 'email'] },
                    { model: db.DamageReportImage, as: 'images' },
                    {
                        model: db.DamageReportReply,
                        as: 'replies',
                        include: [
                            { model: db.Users, as: 'admin', attributes: ['id', 'mobile_number'] },
                            { model: db.DamageReportImage, as: 'images' }
                        ]
                    }
                ]
            });

            if (!report) {
                throw new AppError("Damage report not found", 404);
            }

            return report;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all damage reports for a booking
     */
    async getDamageReportsByBooking(bookingId, customerId, filters = {}) {
        try {
            // Verify booking exists and belongs to customer
            const booking = await db.Bookings.findOne({
                where: { id: bookingId, passengerId: customerId }
            });

            if (!booking) {
                throw new AppError("Booking not found", 404);
            }

            const where = { bookingId };

            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.severity) {
                where.severity = filters.severity;
            }

            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.DamageBaggageReport.findAndCountAll({
                where,
                include: [
                    { model: db.DamageReportImage, as: 'images' },
                    {
                        model: db.DamageReportReply,
                        as: 'replies',
                        include: [
                            { model: db.Users, as: 'admin', attributes: ['id', 'mobile_number'] }
                        ]
                    }
                ],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                reports: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Reply to a damage report (admin only)
     */
    async replyToDamageReport(reportId, adminId, replyData) {
        try {
            // Verify report exists
            const report = await db.DamageBaggageReport.findByPk(reportId);
            if (!report) {
                throw new AppError("Damage report not found", 404);
            }

            // Create reply
            const reply = await db.DamageReportReply.create({
                damageReportId: reportId,
                repliedBy: adminId,
                replyMessage: replyData.replyMessage
            });

            // Add images if provided
            if (replyData.images && replyData.images.length > 0) {
                const images = replyData.images.map(url => ({
                    damageReportId: reportId,
                    replyId: reply.id,
                    imageUrl: url,
                    type: 'reply'
                }));
                await db.DamageReportImage.bulkCreate(images);
            }

            // Update report status to under-review
            await report.update({ status: 'under-review' });

            // Fetch complete reply with images
            return await db.DamageReportReply.findOne({
                where: { id: reply.id },
                include: [
                    { model: db.Users, as: 'admin', attributes: ['id', 'mobile_number'] },
                    { model: db.DamageReportImage, as: 'images' }
                ]
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update damage report status
     */
    async updateDamageReportStatus(reportId, status) {
        try {
            const report = await db.DamageBaggageReport.findByPk(reportId);
            if (!report) {
                throw new AppError("Damage report not found", 404);
            }

            await report.update({ status });
            return await this.getDamageReportById(reportId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all damage reports (admin - with filters)
     */
    async getAllDamageReports(filters = {}) {
        try {
            const where = {};

            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.severity) {
                where.severity = filters.severity;
            }
            if (filters.searchKey) {
                where[db.sequelize.Op.or] = [
                    { baggageDescription: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('baggageDescription')), db.sequelize.Op.like, `%${filters.searchKey.toLowerCase()}%`) },
                    { damageDescription: db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('damageDescription')), db.sequelize.Op.like, `%${filters.searchKey.toLowerCase()}%`) }
                ];
            }

            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.DamageBaggageReport.findAndCountAll({
                where,
                include: [
                    { model: db.Bookings, as: 'booking', attributes: ['id', 'bookingReference'] },
                    { model: db.Users, as: 'customer', attributes: ['id', 'mobile_number', 'email'] },
                    { model: db.DamageReportImage, as: 'images' },
                    {
                        model: db.DamageReportReply,
                        as: 'replies',
                        include: [
                            { model: db.Users, as: 'admin', attributes: ['id', 'mobile_number'] }
                        ]
                    }
                ],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                reports: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete damage report (soft delete - update status to rejected)
     */
    async deleteDamageReport(reportId) {
        try {
            const report = await db.DamageBaggageReport.findByPk(reportId);
            if (!report) {
                throw new AppError("Damage report not found", 404);
            }

            await report.update({ status: 'rejected' });
            return { success: true, message: "Damage report deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DamageBaggageReportService();
