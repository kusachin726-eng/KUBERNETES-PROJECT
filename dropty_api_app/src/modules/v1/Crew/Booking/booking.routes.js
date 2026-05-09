const express = require("express");

const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const BookingController = require("./booking.controller");
const {  } = require("./validations");
const checkRole = require("../../../../middleware/auth/checkRole");

const router = express.Router();

router.get(
  "/assignedBookings",
  checkRole(["crew"]),
  catchAsyncErr(BookingController.assignedBookings.bind(BookingController))
)

module.exports = router;