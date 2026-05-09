const express = require("express");
// const catchAsyncErr = require("../../../utils/errorHandler/catchAsyncErr");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const CustomerNotificationController = require("./notification.controller");
const checkRole = require("../../../../middleware/auth/checkRole");

const router = express.Router();

// All Notifications
router.get(
  "/",
  checkRole(["customer"]), 
  catchAsyncErr(CustomerNotificationController.getAllNotifications)
);

// For single, All Delete & single Read Notification
router.patch(
  "/",
  checkRole(["customer"]), 
  CustomerNotificationController.updateNotification
);

module.exports = router;
