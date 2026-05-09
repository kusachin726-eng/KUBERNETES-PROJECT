const express = require("express");

const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const BookingController = require("./booking.controller");
const { pnrDetailsValidation, bookingValidation, bookingAddressValidation, timeSlotValidation, confirmBookingValidation, confirmBookingValid, cancelBookingValidation } = require("./validations");
const checkRole = require("../../../../middleware/auth/checkRole");

const router = express.Router();

router.get("/airlines/list", checkRole(["customer"]), catchAsyncErr(BookingController.getAirlinesList.bind(BookingController)));

router.post(
  "/getPnrDetails",
  pnrDetailsValidation,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.pnrDetails.bind(BookingController))
);

router.get(
  "/airline/extraBaggageFaresByAirline/:airlineId",
  checkRole(["customer"]),
  catchAsyncErr(BookingController.getExtraBaggageFaresByAirline.bind(BookingController))
)

router.post(
  "/initiateBooking",
  bookingValidation,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.initiateBooking.bind(BookingController))
)

router.post(
  "/createBookingAddress",
  bookingAddressValidation,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.createBookingAddress.bind(BookingController))
)

router.post(
  "/availableTimeSlots",
  timeSlotValidation,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.availableTimeSlots.bind(BookingController))
)

router.post(
  "/createBookingTimeslot",
  confirmBookingValidation,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.createBookingTimeslot.bind(BookingController))
)

router.post(
  "/confirmBooking",
  confirmBookingValid,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.confirmBooking.bind(BookingController))
)

router.get(
  "/details/:bookingId",
  checkRole(["customer"]),
  catchAsyncErr(BookingController.getBookingDetails.bind(BookingController))
)


router.get(
  "/",
  checkRole(["customer"]),
  catchAsyncErr(BookingController.getBookings.bind(BookingController))
)

router.get(
  "/cancelOptionsList",
  checkRole(["customer"]),
  catchAsyncErr(BookingController.cancelOptionsList.bind(BookingController))
)

router.post(
  "/cancelBooking",
  cancelBookingValidation,
  checkRole(["customer"]),
  catchAsyncErr(BookingController.cancelBooking.bind(BookingController))
)

module.exports = router;