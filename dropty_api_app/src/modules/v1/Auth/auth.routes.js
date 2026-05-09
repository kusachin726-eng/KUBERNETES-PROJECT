const express = require("express");

const catchAsyncErr = require("../../../utils/errorHandler/catchAsyncErr");
const AuthController = require("./auth.controller");
const { mobileValidation, customerMobile, otpValidation } = require("./validations");
const checkRole = require("../../../middleware/auth/checkRole");

const router = express.Router();


router.post(
	"/verifyMobileNumber",
	mobileValidation,
	catchAsyncErr(AuthController.verifyMobileNo.bind(AuthController))
);

router.post(
    "/verifyOtp",
    otpValidation,
    catchAsyncErr(AuthController.verifyOtp.bind(AuthController))
)


module.exports = router;