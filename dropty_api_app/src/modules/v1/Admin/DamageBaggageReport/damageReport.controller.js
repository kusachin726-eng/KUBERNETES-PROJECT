const damageReportService = require("./damageReport.service");
const AppError = require("../../../../utils/errorHandler/appError");
const { requestContext } = require("../../../../utils/auditLog/auditRequestContext");

class DamageReportController {
    /**
     * Create a new damage baggage report (Customer)
     */
    async createDamageReport(req, res, next) {
        try {
            const bookingId = parseInt(req.params.bookingId);
            const customerId = req.user.id;

            const report = await damageReportService.createDamageReport(
                bookingId,
                customerId,
                req.body
            );

            res.status(201).json({
                success: true,
                message: "Damage report created successfully",
                data: report
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get damage reports for a booking (Customer)
     */
    async getDamageReportsByBooking(req, res, next) {
        try {
            const bookingId = parseInt(req.params.bookingId);
            const customerId = req.user.id;
            const filters = {
                page: req.query.page,
                limit: req.query.limit,
                status: req.query.status,
                severity: req.query.severity,
                searchKey: req.query.searchKey
            };

            const result = await damageReportService.getDamageReportsByBooking(
                bookingId,
                customerId,
                filters
            );

            res.status(200).json({
                success: true,
                message: "Damage reports retrieved successfully",
                data: result.reports,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get single damage report (Customer)
     */
    async getDamageReport(req, res, next) {
        try {
            const reportId = parseInt(req.params.reportId);
            const customerId = req.user.id;

            const report = await damageReportService.getDamageReportById(reportId);

            // Verify report belongs to customer
            if (report.customerId !== customerId) {
                throw new AppError("You do not have permission to access this report", 403);
            }

            res.status(200).json({
                success: true,
                message: "Damage report retrieved successfully",
                data: report
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reply to damage report (Admin)
     */
    async replyToDamageReport(req, res, next) {
        try {
            const reportId = parseInt(req.params.reportId);
            const adminId = req.user.id;

            const reply = await damageReportService.replyToDamageReport(
                reportId,
                adminId,
                req.body
            );

            res.status(201).json({
                success: true,
                message: "Reply added successfully",
                data: reply
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update damage report status (Admin)
     */
    async updateDamageReportStatus(req, res, next) {
        try {
            const reportId = parseInt(req.params.reportId);
            const { status } = req.body;

            const report = await damageReportService.updateDamageReportStatus(reportId, status);

            res.status(200).json({
                success: true,
                message: "Damage report status updated successfully",
                data: report
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all damage reports (Admin)
     */
    async getAllDamageReports(req, res, next) {
        try {
            const filters = {
                page: req.query.page,
                limit: req.query.limit,
                status: req.query.status,
                severity: req.query.severity,
                searchKey: req.query.searchKey
            };

            const result = await damageReportService.getAllDamageReports(filters);

            res.status(200).json({
                success: true,
                message: "All damage reports retrieved successfully",
                data: result.reports,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete damage report (Admin)
     */
    async deleteDamageReport(req, res, next) {
        try {
            const reportId = parseInt(req.params.reportId);

            const result = await damageReportService.deleteDamageReport(reportId);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DamageReportController();
