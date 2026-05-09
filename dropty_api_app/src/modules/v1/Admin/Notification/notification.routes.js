const express = require("express");
// const catchAsyncErr = require("../../../utils/errorHandler/catchAsyncErr");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const AdminNotificationController = require("./notification.controller");
const checkRole = require("../../../../middleware/auth/checkRole");

const router = express.Router();

// Bulk Notifications
router.post(
  "/send-bulk-notification",
  checkRole(["admin"]), // only admin can send bulk push
  catchAsyncErr(AdminNotificationController.sendNotificationToUsers)
);

module.exports = router;
