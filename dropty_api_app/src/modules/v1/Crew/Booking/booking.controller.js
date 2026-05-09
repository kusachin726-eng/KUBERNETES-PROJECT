const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const AppError = require("../../../../utils/errorHandler/appError");
const db = require("../../../../data-access/sequelize/models");
const BookingService = require("./booking.service");

class BookingController {
    async assignedBookings(req, res, next) {        
        const crewId = req.user.id;

        let booking = await BookingService.getAssignedBookings({
            crewId,
            bookingStatus: ["ACCEPTED"]
        });
        if (!booking) {
            return next(new AppError('No assigned bookings found', 404));
        }
        return res.status(200).json({
            success: true,
            data: booking
        });
    }
}

module.exports = new BookingController();
