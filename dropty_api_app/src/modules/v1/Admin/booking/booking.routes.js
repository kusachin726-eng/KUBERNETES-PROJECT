const express = require("express");  
const bookingController = require("./booking.controller");
const {
    customerValidations,
    userValidations
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const statusHandler = require("../../../../utils/statushandler");
const router = express.Router();


/***************************** Admin routes *******************************/
router.get(
    "/list",
    authenticateJWT(['admin']),
    checkPermission('booking', 'canView'),    
    catchAsyncErr(bookingController.list.bind(bookingController))
);

router.get(
    "/details/:bookingId",
    authenticateJWT(['admin']),
    checkPermission('booking', 'canView'),
    catchAsyncErr(bookingController.getBookingDetails.bind(bookingController))
);

router.post(
    "/assignCrew",
    authenticateJWT(['admin']),
    checkPermission('booking', 'canEdit'),    
    catchAsyncErr(bookingController.assignCrew.bind(bookingController))
)

router.get(
    "/crewList",
    authenticateJWT(['admin']),
    checkPermission('booking', 'canView'),    
    catchAsyncErr(bookingController.crewList.bind(bookingController))
)

module.exports = router;