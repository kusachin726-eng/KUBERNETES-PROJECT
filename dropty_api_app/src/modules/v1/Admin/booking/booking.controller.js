const AppError = require("../../../../utils/errorHandler/appError");

const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const bookingServices = require("./booking.service");
const db = require("../../../../data-access/sequelize/models");
const { consoleLogger } = require("../../../../config/logger");
class BookingController {
    async list(req, res, next) {
        const {
            page = 1,
            limit = 10,
            searchKey = "",
            sortBy = "createdAt",
            sortOrder = "DESC",
        } = req.query;

        const offset = (page - 1) * limit;

        const filters = {
            searchKey,
            bookingStatus: req.query.bookingStatus || ["REQUESTED", "ACCEPTED", "CONFIRMED", "CANCELLED"]
        };

        const sortOptions = {
            sortBy,
            sortOrder,
        };

        const customerList = await bookingServices.getAllBookings(
            filters,
            limit,
            offset,
            sortOptions,
            { isListView: true }
        );

        res.status(200).json({
            success: true,
            data: customerList
        });
    }

    async assignCrew(req, res, next) {
        const { bookingId, crewId } = req.body;
        if (!bookingId || !crewId) {
            throw new AppError("bookingId and crewId required", 400)
        }

        const booking = await db.Bookings.findOne({
            attributes: ["id"],
            include: [
                {
                    model: db.BookingLogistics,
                    as: 'logistics',
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                },
            ],
            where: {
                id: bookingId
            }
        });

        if (!booking) {
            return next(new AppError("Booking not found", 404));
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const now = new Date();
        const expirationTime = new Date(now.getTime() + 10 * 60000);

        await booking.logistics.update({
            assignedCrewId: crewId,
            pickupStartOTP: otp
        });

        const bookingStatusLog = {
            bookingId: booking.id,
            previousStatus: "REQUESTED",
            newStatus: "ACCEPTED",
            remarks: 'Booking accepted and crew assigned',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const { statusLog, created } = await bookingServices.createBookingStatusLog(bookingStatusLog);

        if (!created) {
            consoleLogger.info(`Status log already exists for booking ${booking.id}`);
        }

        await booking.update({ bookingStatus: "ACCEPTED" });

        res.status(200).json({
            success: true,
            message: "Crew assigned successfully",
            data: booking
        });
    }

    async getBookingDetails(req, res, next) {
        const { bookingId } = req.params;

        if (!bookingId) {
            return next(new AppError("Booking id is required", 400));
        }

        const result = await bookingServices.getAllBookings(
            { id: bookingId }, //filter by primary key
        );

        const booking = result?.rows?.[0];

        if (!booking) {
            return next(new AppError("Booking not found", 404));
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    }


    async crewList(req, res, next) {
        try {
            const searchKey = req.query.searchKey?.trim() || "";

            const crewMembers = await bookingServices.userList({
                searchKey,
                userType: 'crew'
            });

            res.status(200).json({
                success: true,
                data: crewMembers
            });
        } catch (error) {
            next(new AppError(`Failed to fetch crew members: ${error.message}`, 500));
        }
    }
}

module.exports = new BookingController();