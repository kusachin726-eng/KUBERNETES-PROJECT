const express = require("express");
const router = express.Router();
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const DamageReportController = require("./damageReport.controller");
const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");

const {
    listDamageReports,
    replyToDamageReport,
    updateDamageReportStatus,
    damageReportIdParam,

} = require("./validations");

// Get all damage reports listDamageReports: validate({ query: listDamageReports, params: bookingIdParam }),
router.get(
    "/booking/:bookingId",
    listDamageReports,
    authenticateJWT(['admin']),
    checkPermission('booking', 'canView'),
    catchAsyncErr(DamageReportController.getAllDamageReports.bind(DamageReportController))
);

// Reply to damage report
router.post(
    "/reportId/:reportId/reply",
    replyToDamageReport,
    authenticateJWT(['admin']),
    checkPermission('booking', 'canEdit'),
    catchAsyncErr(DamageReportController.replyToDamageReport.bind(DamageReportController))
);

// Update damage report status
router.patch(
    "/reportId/:reportId/status",
    authenticateJWT(['admin']),
    checkPermission('booking', 'canEdit'),
    updateDamageReportStatus,
    catchAsyncErr(DamageReportController.updateDamageReportStatus.bind(DamageReportController))
);

// Delete damage report
router.delete(
    "/damage-report/:reportId",
    authenticateJWT(['admin']),
    checkPermission('booking', 'canDelete'),
    damageReportIdParam,
    catchAsyncErr(DamageReportController.deleteDamageReport.bind(DamageReportController))
);

module.exports = router;
