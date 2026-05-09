const { Op, fn, col, where } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");
const AppError = require('../../../../utils/errorHandler/appError');


class BookingServices {
  async getAllBookings(filters, limit, offset, sortOptions, options = {}) {
    try {
      const whereClause = {};
      const isListView = options.isListView === true;

      const EXCLUDE_COMMON = ['id', 'bookingId', 'metadata', 'createdAt', 'updatedAt', 'deletedAt'];

      // searchKey 
      let passengerBookingIds = [];

      if (filters.searchKey) {
        const search = `%${filters.searchKey.trim()}%`;

        const passengerMatches = await db.BookingPassengers.findAll({
          attributes: ['bookingId'],
          where: {
            passengerName: { [Op.iLike]: search }
          },
          raw: true
        });

        passengerBookingIds = passengerMatches.map(p => p.bookingId);

        whereClause[Op.or] = [
          { bookingNumber: { [Op.iLike]: search } }
        ];

        if (passengerBookingIds.length) {
          whereClause[Op.or].push({
            id: { [Op.in]: passengerBookingIds }
          });
        }
      }

      //  OTHER FILTERS
      if (filters.id) {
        whereClause.id = filters.id;
      }

      if (filters.bookingStatus) {
        whereClause.bookingStatus = filters.bookingStatus;
      }

      const safeLimit = filters.id ? undefined : parseInt(limit, 10) || 10;
      const safeOffset = filters.id ? undefined : parseInt(offset, 10) || 0;

      // INCLUDES
      const passengerInclude = {
        model: db.BookingPassengers,
        as: 'passengerList',
        attributes: isListView
          ? ['passengerName']
          : { exclude: EXCLUDE_COMMON },

        separate: isListView,   // important for pagination
        required: false
      };

      const logisticsInclude = {
        model: db.BookingLogistics,
        as: 'logistics',
        attributes: isListView
          ? ['pickupDate']
          : { exclude: EXCLUDE_COMMON },

        ...(isListView
          ? {}
          : {
            include: [
              {
                model: db.Users,
                as: 'assignedCrew',
                attributes: ['id'],
                required: false,
                include: [
                  {
                    model: db.UserProfile,
                    as: 'userProfile',
                    attributes: ['firstName', 'lastName'],
                    required: false
                  }
                ]
              }
            ]
          })
      };

      const includeClause = [
        passengerInclude,
        {
          model: db.BookingAddress,
          as: 'address',
          attributes: isListView ? ['city', 'state'] : { exclude: EXCLUDE_COMMON }
        },
        {
          model: db.Airlines,
          as: 'airline',
          attributes: isListView ? ['airlineName'] : ["airlineName", "airlineLogo", "isActive"]
        },
        {
          model: db.BookingFlightDetails,
          as: 'flightDetails',
          attributes: isListView
            ? ['flightNumber', 'date', 'airportCode', 'terminal']
            : { exclude: EXCLUDE_COMMON }
        },
        logisticsInclude
      ];

      if (!isListView) {
        includeClause.push(
          {
            model: db.BookingStatusLogs,
            as: 'statusLogs',
            attributes: { exclude: EXCLUDE_COMMON }
          },
          {
            model: db.BookingPayments,
            as: 'payments',
            attributes: { exclude: EXCLUDE_COMMON }
          }
        );
      }

      // MAIN QUERY 
      const { count, rows } = await db.Bookings.findAndCountAll({
        where: whereClause,
        include: includeClause,

        limit: safeLimit,
        offset: safeOffset,
        subQuery: false,
        distinct: true,

        attributes: isListView
          ? [
            'id',
            'bookingNumber',
            'bookingStatus',
            'totalAllowedBaggageWeightKg',
            'totalExcessBaggageWeightKg',
            'totalBags',
            'airlineTotalAmount',
            'totalAmount'
          ]
          : { exclude: ['updatedAt', 'deletedAt'] },

        order: [['id', (sortOptions?.sortOrder || 'DESC').toUpperCase()]]
      });

      // FORMAT LIST 
      let formattedRows = rows;

      if (isListView) {
        formattedRows = JSON.parse(JSON.stringify(rows));

        formattedRows.forEach(booking => {
          if (booking.flightDetails?.date) {
            booking.flightDetails.date = formatDateTime(booking.flightDetails.date);
          }

          if (booking.logistics?.pickupDate) {
            booking.logistics.pickupDate = formatDateTime(booking.logistics.pickupDate);
          }
        });
      }

      return { count, rows: formattedRows };

    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }


  async createBookingStatusLog(bookingStatusLog) {
    try {
      const [statusLog, created] = await db.BookingStatusLogs.findOrCreate({
        where: {
          bookingId: bookingStatusLog.bookingId,
          newStatus: bookingStatusLog.newStatus,
          previousStatus: bookingStatusLog.previousStatus
        },
        defaults: bookingStatusLog
      });

      return { statusLog, created };
    } catch (error) {
      throw new AppError(`Failed to create booking status log: ${error.message}`, 500);
    }
  }

  async userList({ searchKey, userType }) {
    try {
      const whereClause = {
        user_type: userType,
        isActive: true,
        deletedAt: null
      };

      if (searchKey) {
        const search = `%${searchKey}%`;
        whereClause[Op.or] = [
          { mobile_number: { [Op.iLike]: search } },
          { email: { [Op.iLike]: search } },
          // Fixed the full name concat search
          db.sequelize.where(
            db.sequelize.fn('concat', db.sequelize.col('userProfile.firstName'), ' ', db.sequelize.col('userProfile.lastName')),
            { [Op.iLike]: search }
          )
        ];
      }

      return await db.Users.findAll({
        where: whereClause,
        attributes: ['id', 'mobile_number', 'email'],
        include: [{
          model: db.UserProfile,
          as: 'userProfile',
          attributes: ['firstName', 'lastName'],
          required: true // Inner join ensures only users with profiles appear
        }],
        order: [[{ model: db.UserProfile, as: 'userProfile' }, 'firstName', 'ASC']]
      });

    } catch (error) {
      throw new AppError(`Service Error: ${error.message}`, 500);
    }
  }

}

module.exports = new BookingServices();
