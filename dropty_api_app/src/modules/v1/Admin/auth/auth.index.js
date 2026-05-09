const express = require("express");

const AuthController = require("./auth.controller");
const {
	verifyLoginPasswordValidation,
	registerAdminValidation,
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");

const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");

const router = express.Router();


router.post(
	"/verifyEmailPassword",
	verifyLoginPasswordValidation,
	catchAsyncErr(AuthController.verifyEmailPassword.bind(AuthController))
);

router.post(
	"/register",
	registerAdminValidation,
	authenticateJWT(['admin']),
	checkPermission('manage_admin', 'canCreate'),
	catchAsyncErr(AuthController.registerNewAdmin.bind(AuthController))
);


module.exports = router;