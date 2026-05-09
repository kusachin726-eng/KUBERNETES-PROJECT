const express = require("express");
const router = express.Router();
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const DamageReportController = require("./damageReport.controller");
const checkRole = require("../../../../middleware/auth/checkRole");
const validate = require("../../../../middleware/validator");
const Joi = require("@hapi/joi");
const {
    createDamageReport,
    replyToDamageReport,
    updateDamageReportStatus,
    listDamageReports,
    damageReportIdParam,
    bookingIdParam
} = require("./validations");
const { uploadMultipleImages } = require("../../../../middleware/multer/multipleImageUpload");

/**
 * ============ CUSTOMER ROUTES ============
 */

// Create damage baggage report
router.post(
    "/booking/:bookingId/damage-report",
    checkRole(["customer"]),
    createDamageReport,
    catchAsyncErr(DamageReportController.createDamageReport.bind(DamageReportController))
);



// Get damage reports for a booking
router.get(
    "/booking/:bookingId/damage-reports",
    checkRole(["customer"]),
    listDamageReports,
    catchAsyncErr(DamageReportController.getDamageReportsByBooking.bind(DamageReportController))
);

// Get single damage report
router.get(
    "/damage-report/:reportId",
    checkRole(["customer"]),
    damageReportIdParam,
    catchAsyncErr(DamageReportController.getDamageReport.bind(DamageReportController))
);

router.post(
    '/booking/damage-report/uploadImages', 
    uploadMultipleImages,
    checkRole(["customer"]),
    catchAsyncErr(DamageReportController.uploadDamageImages.bind(DamageReportController))
);

/**
 * ============ ADMIN ROUTES ============
 */

// Get all damage reports
router.get(
    "/damage-reports",
    checkRole(["admin"]),
    validate({
        query: Joi.object({
            page: Joi.number().optional(),
            limit: Joi.number().optional(),
            status: Joi.string().valid('reported', 'under-review', 'resolved', 'rejected').optional(),
            severity: Joi.string().valid('minor', 'moderate', 'major').optional(),
            searchKey: Joi.string().optional()
        })
    }),
    catchAsyncErr(DamageReportController.getAllDamageReports.bind(DamageReportController))
);

// Reply to damage report
router.post(
    "/damage-report/:reportId/reply",
    checkRole(["admin"]),
    replyToDamageReport,
    catchAsyncErr(DamageReportController.replyToDamageReport.bind(DamageReportController))
);

// Update damage report status
router.patch(
    "/damage-report/:reportId/status",
    checkRole(["admin"]),
    updateDamageReportStatus,
    catchAsyncErr(DamageReportController.updateDamageReportStatus.bind(DamageReportController))
);

// Delete damage report
router.delete(
    "/damage-report/:reportId",
    checkRole(["admin"]),
    damageReportIdParam,
    catchAsyncErr(DamageReportController.deleteDamageReport.bind(DamageReportController))
);

module.exports = router;
