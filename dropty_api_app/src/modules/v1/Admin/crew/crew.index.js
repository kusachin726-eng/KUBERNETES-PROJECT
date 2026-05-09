const express = require("express");

const crewController = require("./crew.controller");
const { createCrewValidation, updateCrewValidation, updateCrewStatusValidation, validateCrewUniqueValidation } = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");


const router = express.Router();

router.get(
  "/",
  authenticateJWT(["admin"]),
  checkPermission("crew", "canView"),
  catchAsyncErr(crewController.list.bind(crewController))
);

router.post(
  "/",
  
  createCrewValidation,
  authenticateJWT(["admin"]),
  checkPermission("crew", "canCreate"),
  catchAsyncErr(crewController.create.bind(crewController))
);
router.patch(
  "/updateCrewStatus/:userId",
  authenticateJWT(["admin"]),
  checkPermission("crew", "canEdit"),
  updateCrewStatusValidation, // validates userId in body
  catchAsyncErr(crewController.updateCrewStatus.bind(crewController))
);
router.get(
  "/validate-unique",
  validateCrewUniqueValidation,
  authenticateJWT(["admin"]),
  checkPermission("crew", "canView"),
  catchAsyncErr(crewController.validateCrewUnique.bind(crewController))
);
router.patch(
  "/:userId",
  updateCrewValidation,
  authenticateJWT(["admin"]),
  checkPermission("crew", "canEdit"),
  catchAsyncErr(crewController.update.bind(crewController))
);
router.delete(
  "/:userId",
  authenticateJWT(["admin"]),
  checkPermission("crew", "canDelete"),
  catchAsyncErr(crewController.deleteCrew.bind(crewController))
);
router.get(
  "/:userId",                         // GET single crew details
  authenticateJWT(["admin"]),
  checkPermission("crew", "canView"),
  catchAsyncErr(crewController.getCrewById.bind(crewController))
);

module.exports = router;
