const express = require("express");
const airlineController = require("./airline.controller");
const {
    createAirlineValidation,
    updateAirlineValidation,
    extraBagFareValidation
} = require("./validations");

const checkRole = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");


const router = express.Router();


router.post(
    "/",
    checkRole(["admin"]),
    createAirlineValidation,
    checkPermission("admin", "canCreate"),
    catchAsyncErr(airlineController.create.bind(airlineController))
);

router.get(
    "/",
    checkRole(["admin"]),
    checkPermission("admin", "canView"),
    catchAsyncErr(airlineController.list.bind(airlineController))
);

router.get(
    "/detailsById/:id",
    checkRole(["admin"]),
    checkPermission("admin", "canView"),
    catchAsyncErr(airlineController.getById.bind(airlineController))
);

router.patch(
    "/:id",
    checkRole(["admin"]),
    checkPermission("admin", "canEdit"),
    updateAirlineValidation,
    catchAsyncErr(airlineController.update.bind(airlineController))
);


router.delete(
    "/:id",
    checkRole(["admin"]),
    checkPermission("admin", "canDelete"),
    catchAsyncErr(airlineController.delete.bind(airlineController))
);

router.post(
    "/extra-bag-fare/:airlineId",
    checkRole(["admin"]),
    checkPermission("admin", "canCreate"),
    extraBagFareValidation,
    catchAsyncErr(airlineController.addExtraBagFare.bind(airlineController))
);
router.patch(
    "/extra-bag-fare/:id",
    checkRole(["admin"]),
    checkPermission("admin", "canEdit"),
    catchAsyncErr(airlineController.updateExtraBagFarePrice.bind(airlineController))
);

router.delete(
    "/extra-bag-fare/:id",
    checkRole(["admin"]),
    checkPermission("admin", "canDelete"),
    catchAsyncErr(airlineController.deleteExtraBagFare.bind(airlineController))
);

module.exports = router;
