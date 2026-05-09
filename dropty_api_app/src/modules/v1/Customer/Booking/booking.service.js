const { Op, and, where, fn, col } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const { create } = require("@hapi/joi/lib/ref");
const { ref } = require("@hapi/joi");
const createRandomString = require("../../../../utils/createRandomString");
const { formatName } = require("../../../../utils/formatString");
const getCurrentDate = require("../../../../utils/currentDate");
const formatDateTime = require("../../../../utils/dateUtils");
const FormatDateTime = require("../../../../utils/formatDateTime");

class BookingServices {
    computeTotals(amountBeforeGst, gstPercentage) {
        const gstRate = parseFloat(gstPercentage || 0) / 100;
        const totalGST = parseFloat((amountBeforeGst * gstRate).toFixed(2));
        const totalAmount = parseFloat((amountBeforeGst + totalGST).toFixed(2));
        return { totalGST, totalAmount };
    }

    async getExtraBaggageFaresByAirline(airlineId) {
        try {
            const baggageFares = await db.AirlineExtraBagFare.findAll({
                where: { airlineId: airlineId },
                attributes: { exclude: ['airlineId', 'createdAt', 'updatedAt', 'deletedAt'] },
                order: [['additionalKg', 'ASC']]
            });
            return baggageFares;
        } catch (error) {
            throw error;
        }
    }

    async getSettingBySlug(slug) {
        try {
            const setting = await db.Settings.findOne({
                where: {
                    slug: slug,
                    isActive: true
                },
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                raw: true
            });
            return setting.metaData;
        } catch (error) {
            throw error;
        }
    }

    async createBooking(bookingData, passengers, flightDetails,) {
        const transaction = await db.sequelize.transaction();
        try {
            let newBooking = await db.Bookings.create(bookingData, { transaction });
            for (const passenger of passengers) {
                passenger.bookingId = newBooking.id;
            }

            const passengerArray = [];
            for (const passenger of passengers) {
                const extraWeightFares = passenger.extraWeightFares;
                delete passenger.extraWeightFares;
                const createdPassenger = await db.BookingPassengers.create(passenger, { transaction });

                if (extraWeightFares && extraWeightFares.length > 0) {
                    const extraWeightFareData = extraWeightFares.map(fare => ({
                        bookingPassengerId: createdPassenger.id,
                        airlineExtraBagFareId: fare.airlineExtraBagFareId,
                        extraWeightKg: fare.extraWeightKg,
                        extraWeightFare: fare.extraWeightFare,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }));
                    await db.BookingPassengerExtraWeightFare.bulkCreate(extraWeightFareData, { transaction });
                }
                passengerArray.push(JSON.parse(JSON.stringify(createdPassenger)));
            }
            //manage status log
            const bookingStatusLog = {
                bookingId: newBooking.id,
                previousStatus: null,
                newStatus: "INITIATED", // 1- initiated
                remarks: 'Booking initiated',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await db.BookingStatusLogs.create(bookingStatusLog, { transaction });
            const aaaa = await newBooking.update({ bookingStatus: "INITIATED" }, { transaction });
            
            //Flight details
            await db.BookingFlightDetails.create({
                ...flightDetails,
                bookingId: newBooking.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction });

            await transaction.commit();
            newBooking = JSON.parse(JSON.stringify(newBooking));
            newBooking.passengers = passengerArray;
            return newBooking;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getBookingDetails(bookingCondition) {
        try {
            const bookingDetails = await db.Bookings.findOne({
                where: bookingCondition,
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
                                attributes: ['extraWeightKg', 'extraWeightFare', ],
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
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
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

            return bookingDetails;
        } catch (error) {
            throw error;
        }
    }

    async createOrUpdateBookingAddress(addressData, bookingId) {
        try {
            const existingAddress = await db.BookingAddress.findOne({ where: { bookingId: bookingId } });
            if (existingAddress) {
                await existingAddress.update(addressData);
                return existingAddress;
            } else {
                const newAddress = await db.BookingAddress.create({ ...addressData, bookingId: bookingId });
                return newAddress;
            }
        } catch (error) {
            throw error;
        }
    }

    async getBookings(passengerId, { page = 1, limit = 10, bookingStatus = ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'CANCELLED'] }) {
        try {
            const bookings = await db.Bookings.findAndCountAll({
                where: { passengerId: passengerId, bookingStatus: bookingStatus },
                include: [
                    {
                        model: db.BookingAddress,
                        as: 'address',
                        attributes: ["mobile", "address"]
                    },
                    {
                        model: db.BookingStatusLogs,
                        as: 'statusLogs',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: db.BookingFlightDetails,
                        as: 'flightDetails',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: db.Airlines,
                        as: 'airline',
                        attributes: ["airlineName", "airlineLogo", "isActive"]
                    },
                    {
                        model: db.BookingLogistics,
                        as: 'logistics',
                        attributes: { exclude: ['id', 'bookingId', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                ],
                order: [
                    ['createdAt', 'DESC'],
                    [{ model: db.BookingStatusLogs, as: 'statusLogs' }, 'createdAt', 'DESC']
                ],
                attributes: { exclude: ['updatedAt', 'deletedAt'] },
                offset: (page - 1) * limit,
                limit: limit
            });

            return bookings;
        } catch (error) {
            throw error;
        }   
    }
    
}

module.exports = new BookingServices();
