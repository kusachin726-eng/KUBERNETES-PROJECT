const { Op, and, where, fn, col } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const { create } = require("@hapi/joi/lib/ref");
const { ref } = require("@hapi/joi");
const createRandomString = require("../../../../utils/createRandomString");
const { formatName } = require("../../../../utils/formatString");
const getCurrentDate = require("../../../../utils/currentDate");

class BookingServices {
    async getAssignedBookings(options) {
        const { crewId, bookingStatus } = options;
        try {
            const bookings = await db.Bookings.findAll({
                where: {
                    bookingStatus: {
                        [Op.in]: bookingStatus
                    }
                },
                include: [
                    {
                        model: db.BookingStatusLogs,
                        as: 'statusLogs',                       
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: db.BookingPassengers,
                        as: 'passengerList',
                        include: [
                            {
                                model: db.BookingPassengerExtraWeightFare,
                                as: 'extraWeightFares',
                                attributes: ['extraWeightKg', 'extraWeightFare',],
                                include: [
                                    {
                                        model: db.AirlineExtraBagFare,
                                        as: 'airlineExtraBagFare',
                                        attributes: ["baggageType"]
                                    }
                                ]
                            }],
                        attributes: { exclude: ['id', 'bookingId', 'metadata', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: db.BookingAddress,
                        as: 'address',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: db.BookingLogistics,
                        as: 'logistics',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] },
                        where: {
                            assignedCrewId: crewId
                        },
                        required: true
                    },
                    {
                        model: db.BookingPayments,
                        as: 'payments',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt'] }
                    },
                    {
                        model: db.Airlines,
                        as: 'airline',
                        attributes: ["airlineName", "airlineLogo", "isActive"]
                    },
                    {
                        model: db.BookingFlightDetails,
                        as: 'flightDetails',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
                    }
                ],
                order: [
                    [{ model: db.BookingStatusLogs, as: 'statusLogs' }, 'createdAt', 'DESC']
                ],
                attributes: { exclude: ['updatedAt', 'deletedAt'] }
            });

            return bookings;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BookingServices();
