const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const AppError = require("../../../../utils/errorHandler/appError");
const db = require("../../../../data-access/sequelize/models");
const BookingService = require("./booking.service");
const createRandomString = require("../../../../utils/createRandomString");
const { customAlphabet } = require('nanoid');
const params = require("../../../../config/params");
const NotificationEvents = require('../../Notification/events');

class BookingController {
    async pnrDetails(req, res, next) {
        const customerId = req.user.id;
        const { pnr, airlineId, emailOrLastName } = req.body;
        const dummyResponse = {
            "pnr": "SG8K9P",
            "airline": "SpiceJet",
            "bookingStatus": "CONFIRMED",
            "bookingDate": "2026-01-20T09:45:00Z",
            "contactDetails": {
                "email": "ravi.kumar@gmail.com",
                "mobile": "+91-9876543210",
                "lastName": "Kumar"
            },
            "journey": {
                "type": "MULTI_CITY",
                "segments": [
                    {
                        "segmentId": 1,
                        "flightNumber": "SG-8194",
                        "departure": {
                            "airportCode": "DEL",
                            "airportName": "Indira Gandhi International Airport",
                            "city": "New Delhi",
                            "terminal": "T3",
                            "date": "2026-01-25",
                            "time": "10:30"
                        },
                        "arrival": {
                            "airportCode": "BOM",
                            "airportName": "Chhatrapati Shivaji Maharaj International Airport",
                            "city": "Mumbai",
                            "terminal": "T2",
                            "date": "2026-01-25",
                            "time": "12:45"
                        },
                        "boardingPoint": "DEL-T3"
                    },
                    {
                        "segmentId": 2,
                        "flightNumber": "SG-105",
                        "departure": {
                            "airportCode": "BOM",
                            "airportName": "Chhatrapati Shivaji Maharaj International Airport",
                            "city": "Mumbai",
                            "terminal": "T2",
                            "date": "2026-01-25",
                            "time": "14:10"
                        },
                        "arrival": {
                            "airportCode": "BLR",
                            "airportName": "Kempegowda International Airport",
                            "city": "Bengaluru",
                            "terminal": "T1",
                            "date": "2026-01-25",
                            "time": "15:50"
                        },
                        "boardingPoint": "BOM-T2"
                    }
                ]
            },
            "passengers": [
                {
                    "passengerId": "P1",
                    "title": "Mr",
                    "firstName": "Ravi",
                    "lastName": "Kumar",
                    "passengerType": "ADULT",
                    "baggage": {
                        "checkIn": "15 KG",
                        "cabin": "7 KG"
                    }
                },
                {
                    "passengerId": "P2",
                    "title": "Mrs",
                    "firstName": "Neha",
                    "lastName": "Kumar",
                    "passengerType": "ADULT",
                    "baggage": {
                        "checkIn": "15 KG",
                        "cabin": "7 KG"
                    }
                },
                {
                    "passengerId": "P3",
                    "title": "Master",
                    "firstName": "Aarav",
                    "lastName": "Kumar",
                    "passengerType": "CHILD",
                    "baggage": {
                        "checkIn": "10 KG",
                        "cabin": "5 KG"
                    }
                }
            ]
        };


        return res.status(200).json({
            success: true,
            data: dummyResponse

        });
    }

    async getAirlinesList(req, res, next) {
        const airlinesList = await db.Airlines.findAll({
            where: { isActive: true },
            attributes: ['id', 'airlineName', 'airlineLogo']
        });

        return res.status(200).json({
            success: true,
            data: airlinesList
        });
    }

    async getExtraBaggageFaresByAirline(req, res, next) {
        const { airlineId } = req.params;

        const baggageFares = await BookingService.getExtraBaggageFaresByAirline(airlineId);
        // bag and weight fares seperated
        const weightFares = baggageFares.filter(fare => fare.baggageType === 'weight');
        const bagFares = baggageFares.filter(fare => fare.baggageType === 'bag');
        return res.status(200).json({
            success: true,
            data: { weightFares, bagFares }
        });
    }

    async initiateBooking(req, res, next) {
        const nanoid = customAlphabet('0123456789', 7);
        const flightDetails = {
            flightType: req.body.flightType,
            flightNumber: req.body.flightNumber,
            airportCode: req.body.airportCode,
            airportName: req.body.airportName,
            city: req.body.city,
            terminal: req.body.terminal,
            date: req.body.date,
            time: req.body.time
        }
        const bookingData = {
            bookingNumber: `DRP${nanoid()}`,
            passengerId: req.user.id,
            pnr: req.body.pnr,
            airlineId: req.body.airlineId,
            emailOrLastName: req.body.emailOrLastName,

            totalAllowedBaggageWeightKg: 0, // Initialize with 0
            totalExcessBaggageWeightKg: 0,
            totalExcessBaggageFare: 0,

            extraBags: 0,
            totalExtraBagFare: 0,
            totalBags: 0,

            convenienceFee: 0,
            platformFee: 0,

            couponId: null,
            totalDiscount: 0,
            usedCoinAmount: 0,
            totalGST: 0,
            airlineTotalAmount: 0,
            totalAmount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // 2. Get Settings
        const settings = await BookingService.getSettingBySlug('booking-fare');
        bookingData.fare_breakup = {
            dropty_fares: settings || {},
            charges: {
                baseFare: parseFloat(settings.baseFare || 0),
                extraBagCost: 0
            }
        }
        const { baseFare, extraPerBagFare, gstPercentage, platformFee, convenienceFee } = settings;
        const passengersToSave = []; // Renamed to avoid confusion

        // 3. Loop through passengers
        for (const pInput of req.body.passengers) {
            let pObj = {
                passengerName: `${pInput.title} ${pInput.firstName} ${pInput.lastName}`,
                passengerType: pInput.passengerType,
                allowedBaggageWeightKg: pInput.baggage.allowedBaggageWeightKg,
                excessBaggageWeightKg: 0,
                excessBaggageFare: 0,
                allowedBagCount: pInput.baggage.allowedBagCount,
                excessBagCount: 0,
                excessBagFare: 0,
                extraWeightFares: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Calculate base baggage totals
            bookingData.totalAllowedBaggageWeightKg += pObj.allowedBaggageWeightKg;


            // Fetch Extra Baggage Fares from DB
            const selectedIds = pInput.baggage.selectedExtraBaggageFareId || [];
            if (selectedIds.length > 0) {
                const baggageTotals = await db.AirlineExtraBagFare.findAll({
                    where: { id: selectedIds, flightType: req.body.flightType },
                    attributes: ["id", "baggageType", "additionalKg", "additionalKgFare"],
                    raw: true
                });

                for (const bagFare of baggageTotals) {
                    const fare = parseFloat(bagFare.additionalKgFare);
                    if (bagFare.baggageType === 'weight') {
                        pObj.excessBaggageWeightKg += parseFloat(bagFare.additionalKg);
                        pObj.excessBaggageFare += fare;
                    } else if (bagFare.baggageType === 'bag') {
                        pObj.excessBagCount += parseFloat(bagFare.additionalKg);
                        pObj.excessBagFare += fare;
                        bookingData.totalExtraBagFare += fare;
                    }
                    bookingData.airlineTotalAmount += fare;
                    bookingData.totalExcessBaggageWeightKg += parseFloat(bagFare.additionalKg);
                    bookingData.totalExcessBaggageFare += fare;
                    pObj.extraWeightFares.push({
                        airlineExtraBagFareId: bagFare.id,
                        extraWeightKg: bagFare.additionalKg,
                        extraWeightFare: fare
                    });
                }
            }

            // Calculate Fare for extra bags (Dropty Fee)
            const extraBagCost = (parseFloat(extraPerBagFare) * pObj.excessBagCount);

            bookingData.fare_breakup.charges.extraBagCost += parseFloat(extraBagCost.toFixed(2));
            bookingData.extraBags += pObj.excessBagCount;
            bookingData.totalAmount += extraBagCost;
            bookingData.totalBags += (pObj.allowedBagCount + pObj.excessBagCount);
            passengersToSave.push(pObj);
        }

        // 4. Final Calculations
        bookingData.platformFee = parseFloat(platformFee || 0);
        bookingData.convenienceFee = parseFloat(convenienceFee || 0);

        bookingData.totalAmount += parseFloat(baseFare || 0);
        bookingData.totalAmount += bookingData.platformFee + bookingData.convenienceFee;
        const gstRate = parseFloat(gstPercentage || 0) / 100;
        bookingData.totalGST = parseFloat((bookingData.totalAmount * gstRate).toFixed(2));
        bookingData.totalAmount += bookingData.totalGST;
        bookingData.totalAmount = parseFloat(bookingData.totalAmount.toFixed(2));

        const newBooking = await BookingService.createBooking(bookingData, passengersToSave, flightDetails);
        return res.status(200).json({
            success: true,
            data: newBooking,
        });
    }

    async getBookingDetails(req, res, next) {
        const { bookingId } = req.params;
        const passengerId = req.user.id;
        const bookingDetails = await BookingService.getBookingDetails({ id: bookingId, passengerId });

        if (!bookingDetails) {
            return next(new AppError('Booking not found', 404));
        }

        return res.status(200).json({
            success: true,
            data: bookingDetails
        });
    }

    async createBookingAddress(req, res, next) {
        const { bookingId, totalDistanceKm } = req.body;
        const passengerId = req.user.id;

        let booking = await BookingService.getBookingDetails({ id: bookingId, passengerId });
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }
        let settings = await BookingService.getSettingBySlug('booking-fare');
        if (totalDistanceKm > 0) {
            const freeDistanceKm = settings.freeDistanceKm || 5;
            const perKmFareAfterFree = settings.perKmFareAfterFree || 0;

            if (totalDistanceKm > freeDistanceKm) {
                const excessKm = totalDistanceKm - freeDistanceKm;
                const excessFare = parseFloat((excessKm * perKmFareAfterFree).toFixed(2));
                req.body.execessKm = excessKm;
                req.body.execessKmFare = excessFare;
            }
        }
        if (req.body.addressType === 'Other') {
            req.body.addressType = req.body.addressTypeOther || 'Other'; // Use the custom value for 'Other'
        }

        if (req.body.latitude && req.body.longitude) {
            req.body.coordinates = { type: 'Point', coordinates: [req.body.longitude, req.body.latitude] }
        }

        const updatedAddress = await BookingService.createOrUpdateBookingAddress(req.body, bookingId);
        if (req.body.execessKmFare && req.body.execessKmFare > 0) {
            const gstRate = parseFloat(settings.gstPercentage || 0) / 100;
            const calculateNewGST = parseFloat((req.body.execessKmFare * gstRate).toFixed(2));
            booking.totalGST = parseFloat(booking.totalGST || 0) + calculateNewGST;
            const newTotalAmount = parseFloat(booking.totalAmount) + parseFloat(req.body.execessKmFare) + parseFloat(calculateNewGST);
            booking.excessKmFare = req.body.execessKmFare;
            booking.totalAmount = parseFloat(newTotalAmount.toFixed(2));
            await booking.save();
        }
        return res.status(200).json({
            success: true,
            data: updatedAddress
        });
    }

    async availableTimeSlots(req, res, next) {
        const { bookingId } = req.body;
        const passengerId = req.user.id;

        let booking = await BookingService.getBookingDetails({ id: bookingId, passengerId });
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }
        /*
            1. Company open 05:00–23:00
            2. Flight date & time given
            3. Pickup must end 6 hours before flight
            4. Pickup range goes 48 hours before flight time
            5. Each pickup slot = 2 hours
            6. Slots never cross business hours
        */
        const settings = await BookingService.getSettingBySlug('booking-time-slot');
        const timeslotCalc = {
            flightDate: booking.flightDetails.date,
            flightTime: booking.flightDetails.time,

            companyOpen: settings.companyOpen || params.BOOKING_TIME_SLOTS_RULES.companyOpen,
            companyClose: settings.companyClose || params.BOOKING_TIME_SLOTS_RULES.companyClose,
            slotDurationHours: settings.slotDurationHours || params.BOOKING_TIME_SLOTS_RULES.slotDurationHours,
            hoursBeforePickupEnd: settings.hoursBeforePickupEnd || params.BOOKING_TIME_SLOTS_RULES.hoursBeforePickupEnd,
            hoursBeforePickupStart: settings.hoursBeforePickupStart || params.BOOKING_TIME_SLOTS_RULES.hoursBeforePickupStart
        }

        const bookingTimeSlot = this.computeAvailableTimeSlots(timeslotCalc);

        return res.status(200).json({
            success: true,
            data: bookingTimeSlot
        });

    }

    computeAvailableTimeSlots({ flightDate, flightTime, companyOpen, companyClose, slotDurationHours, hoursBeforePickupEnd, hoursBeforePickupStart }) {
        const result = [];

        // Parse YYYY-MM-DD without timezone shifts
        const parseYmd = (value) => {
            const [y, m, d] = String(value).split("-").map(Number);
            return { y, m, d };
        };

        // Parse HH:mm
        const parseHm = (value) => {
            const [h, m] = String(value).split(":").map(Number);
            return { h, m };
        };

        // Build local datetime from date + time parts
        const { y, m, d } = parseYmd(flightDate);
        const { h: flightH, m: flightM } = parseHm(flightTime);
        const flightDateTime = new Date(y, m - 1, d, flightH, flightM, 0, 0);

        // Pickup must end this much before flight
        const pickupEndLimit = new Date(flightDateTime);
        pickupEndLimit.setHours(pickupEndLimit.getHours() - hoursBeforePickupEnd);

        // Pickup start window date (exact 48h before flight)
        const pickupStartLimit = new Date(flightDateTime);
        pickupStartLimit.setHours(
            pickupStartLimit.getHours() - hoursBeforePickupStart
        );

        // Set a specific time on a given date (local)
        const setTime = (date, time) => {
            const { h, m } = parseHm(time);
            const d = new Date(date);
            d.setHours(h, m, 0, 0);
            return d;
        };

        const now = new Date();
        now.setSeconds(0, 0);

        const windowStart = pickupStartLimit;
        const windowEnd = pickupEndLimit;

        if (now >= windowEnd) {
            return result;
        }

        let effectiveStart = new Date(windowStart);
        if (now > windowStart && now < windowEnd) {
            effectiveStart = new Date(now);
            effectiveStart.setHours(effectiveStart.getHours() + slotDurationHours);
        }

        // Start from first date in range (midnight)
        let day = new Date(windowStart);
        day.setHours(0, 0, 0, 0);

        // Format date as "D Mon YYYY" (e.g., "6 Feb 2026")
        const formatDateLocal = (date) => {
            const dd = date.getDate();
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const mm = months[date.getMonth()];
            const yy = date.getFullYear();
            return `${dd} ${mm} ${yy}`;
        };

        // Format time as hh:mm AM/PM
        const formatTime12h = (date) => {
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const suffix = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            if (hours === 0) hours = 12;
            return `${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
        };

        // Round up to the next step boundary (e.g., 1-hour steps)
        const roundUpToStep = (date, base, stepHours) => {
            const stepMs = stepHours * 60 * 60 * 1000;
            const diff = Math.max(0, date.getTime() - base.getTime());
            const steps = Math.ceil(diff / stepMs);
            return new Date(base.getTime() + steps * stepMs);
        };

        // Slot start times advance by this step, while duration can be longer
        const slotStepHours = 1;
        const effectiveStartDay = new Date(effectiveStart);
        effectiveStartDay.setHours(0, 0, 0, 0);

        while (day <= windowEnd) {
            // Never show days before effective start day
            if (day < effectiveStartDay) {
                day.setDate(day.getDate() + 1);
                continue;
            }

            const dayOpen = setTime(day, companyOpen);
            const dayClose = setTime(day, companyClose);

            let dayStart = new Date(dayOpen);
            let dayEnd = new Date(dayClose);

            // Respect global window start/end for each day
            if (
                day.getFullYear() === effectiveStart.getFullYear() &&
                day.getMonth() === effectiveStart.getMonth() &&
                day.getDate() === effectiveStart.getDate()
            ) {
                dayStart = new Date(Math.max(dayStart.getTime(), effectiveStart.getTime()));
            }

            if (
                day.getFullYear() === windowEnd.getFullYear() &&
                day.getMonth() === windowEnd.getMonth() &&
                day.getDate() === windowEnd.getDate()
            ) {
                dayEnd = new Date(Math.min(dayEnd.getTime(), windowEnd.getTime()));
            }

            if (dayStart >= dayEnd) {
                day.setDate(day.getDate() + 1);
                continue;
            }

            let slotStart = roundUpToStep(dayStart, dayOpen, slotStepHours);

            const slots = [];

            while (true) {
                const slotEnd = new Date(slotStart);
                slotEnd.setHours(slotEnd.getHours() + slotDurationHours);

                // Stop if slot would exceed business hours or pickup end limit
                if (slotEnd > dayEnd) break;

                slots.push({
                    startTime: formatTime12h(slotStart),
                    endTime: formatTime12h(slotEnd)
                });

                // Sliding window: advance by step (e.g., 1 hour)
                slotStart.setHours(slotStart.getHours() + slotStepHours);
            }

            if (slots.length) {
                result.push({
                    date: formatDateLocal(day),
                    slots
                });
            }

            day.setDate(day.getDate() + 1);
        }
        return result;
    }

    async getBookings(req, res, next) {
        const passengerId = req.user.id;
        const { 
            page = 1, 
            limit = 10,
            bookingStatus = req.query.bookingStatus ? (Array.isArray(req.query.bookingStatus) ? req.query.bookingStatus : [req.query.bookingStatus]) : ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] 
        } = req.query;
        
        const bookings = await BookingService.getBookings(passengerId, { page, limit, bookingStatus });

        return res.status(200).json({
            success: true,
            data: bookings
        });
    }

    async createBookingTimeslot(req, res, next) {
        const { bookingId, pickupDate, pickupStartTime, pickupEndTime } = req.body;
        const passengerId = req.user.id;

        let booking = await BookingService.getBookingDetails({ id: bookingId, passengerId });
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        const bookingLogitics = {
            pickupDate: pickupDate,
            pickupTimeSlotStart: pickupStartTime,
            pickupTimeSlotEnd: pickupEndTime
        }
        let checkLogisticEntry = await db.BookingLogistics.findOne({
            where: {
                bookingId: bookingId
            }
        });

        if (checkLogisticEntry) {
            await checkLogisticEntry.update(bookingLogitics);
        } else {
            bookingLogitics.bookingId = bookingId;
            checkLogisticEntry = await db.BookingLogistics.create(bookingLogitics)
        }
        return res.status(200).json({
            success: true,
            data: checkLogisticEntry
        })
    }

    async confirmBooking(req, res, next) {
        const { bookingId } = req.body;
        const passengerId = req.user.id;

        let booking = await BookingService.getBookingDetails({ id: bookingId, passengerId });
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }
        if (booking.statusLogs[0].newStatus.title === "REQUESTED") {
            return next(new AppError('Booking is already REQUESTED'));
        }
        const previousStatusId = booking.statusLogs[0].newStatusId
        await db.BookingStatusLogs.create({
            bookingId: bookingId,
            previousStatus: "INITIATED",  // initiated
            newStatus: "REQUESTED", // requested
        })
        booking.bookingStatus = "REQUESTED";
        await booking.save();

        NotificationEvents.bookingConfirmed(bookingId, passengerId);

        return res.status(200).json({
            success: true,
            message: "Booking Confirmed",
            // notification: notificationResult
        })
    }

    async cancelOptionsList(req, res, next) {
        const cancelOptions = params.BOOKING_CANCEL_OPTIONS || [
            "Flight Cancelled by Airline",
            "Schedule Change by Airline",
            "Personal Reasons",
            "Health Issues",
            "Other"
        ];

        return res.status(200).json({
            success: true,
            data: cancelOptions,
            message: "Cancel options fetched successfully"
        });
    }

    async cancelBooking(req, res, next) {
        const { bookingId, cancelReason } = req.body;
        const passengerId = req.user.id;

        let booking = await BookingService.getBookingDetails({ id: bookingId, passengerId });
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        if (booking.bookingStatus === "CANCELLED") {
            return next(new AppError('Booking is already CANCELLED'));
        }
        await db.BookingStatusLogs.create({
            bookingId: bookingId,
            previousStatus: booking.bookingStatus,
            newStatus: "CANCELLED",
            remarks: cancelReason || "No reason provided",
            createdAt: new Date(),
            updatedAt: new Date()
        })        

        booking.bookingStatus = "CANCELLED";
        booking.canceledBy = passengerId;
        booking.cancellationReason = cancelReason || "No reason provided";
        booking.cancellationDate = new Date();
        await booking.save();


        NotificationEvents.bookingCancelled(bookingId, passengerId);


        return res.status(200).json({
            success: true,
            message: "Booking Cancelled successfully"
        })
    }


}

module.exports = new BookingController();
