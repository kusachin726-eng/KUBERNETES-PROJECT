const express = require("express");
const AuditLogsController = require("./auditLogs.controller");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");


const router = express.Router();


router.get(
    "/getAuditLogs",
    authenticateJWT(['admin']),
    checkPermission('settings', 'canView'),
    catchAsyncErr(AuditLogsController.getAuditLogs.bind(AuditLogsController))
);


module.exports = router;
