const express = require("express");

const settingsController = require("./settings.controller");
const {
    addSettingsValidation,
    updateSettingsValidation,
    settingsIdValidation,
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");

const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");

const router = express.Router();

router.get(
  "/list",
  authenticateJWT(['admin']),               
  checkPermission('settings', 'canView'),
  catchAsyncErr(settingsController.list.bind(settingsController))
);
router.get(
  "/:id",
  settingsIdValidation,
  authenticateJWT(['admin']),
  checkPermission('settings', 'canView'),
  catchAsyncErr(settingsController.settingById.bind(settingsController))
);
router.post(
  "/",
  addSettingsValidation,                     
  authenticateJWT(['admin']),               
  checkPermission('settings', 'canCreate'),  
  catchAsyncErr(settingsController.addNewSettings.bind(settingsController))
);
router.patch(
  "/updateSettings/:id",
  settingsIdValidation,
  updateSettingsValidation,
  authenticateJWT(['admin']),
  checkPermission('settings', 'canEdit'),
  catchAsyncErr(settingsController.updateSettings.bind(settingsController))
);

module.exports = router;
