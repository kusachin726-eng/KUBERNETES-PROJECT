const express = require("express");

const staffController = require("./staff.controller");

const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const statusHandler = require("../../../../utils/statushandler");

const router = express.Router();

router.get(
  "/",
  authenticateJWT(["admin"]),
  checkPermission("staff", "canView"),
  catchAsyncErr(staffController.list.bind(staffController))
);

router.get(
  "/:id",
  authenticateJWT(["admin"]),
  checkPermission("staff", "canView"),
  catchAsyncErr(staffController.getById.bind(staffController))
);

router.patch(
  "/:id",
  authenticateJWT(["admin"]),
  checkPermission("staff", "canEdit"),
  catchAsyncErr(staffController.update.bind(staffController))
);

router.delete(
  "/:id",
  authenticateJWT(["admin"]),
  checkPermission("staff", "canDelete"),
  catchAsyncErr(staffController.delete.bind(staffController))
);

router.post(
  "/status",
  authenticateJWT(["admin"]),
  statusHandler.handle
);

module.exports = router;
