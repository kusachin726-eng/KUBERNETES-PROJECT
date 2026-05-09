'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookings.belongsTo(models.Users, { foreignKey: 'passengerId', as: 'passenger' });
      Bookings.hasMany(models.BookingPassengers, { foreignKey: 'bookingId', as: 'passengerList' });
      Bookings.belongsTo(models.Airlines, { foreignKey: 'airlineId', as: 'airline' });
      Bookings.hasOne(models.BookingAddress, { foreignKey: 'bookingId', as: 'address' });
      Bookings.hasOne(models.BookingLogistics, { foreignKey: 'bookingId', as: 'logistics' });
      Bookings.hasMany(models.BookingStatusLogs, { foreignKey: 'bookingId', as: 'statusLogs' });
      Bookings.hasMany(models.BookingPayments, { foreignKey: 'bookingId', as: 'payments' });
      Bookings.hasOne(models.BookingFlightDetails, { foreignKey: 'bookingId', as: 'flightDetails' });
    }
  }
  Bookings.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    bookingStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passengerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    pnr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airlineId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'airlines',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    emailOrLastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /**************************************************************** */
    totalAllowedBaggageWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    totalExcessBaggageWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    totalExcessBaggageFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    /************************************************************ */
    extraBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalExtraBagFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    totalBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    airlineTotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    excessKmFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    /**************************** Charge breakdown fields ************************************/


    convenienceFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    platformFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    couponId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    usedCoinAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    totalGST: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    fare_breakup: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null
    },
    cgst: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    sgst: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    igst: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },

    // Cancellation details
    canceledBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Bookings',
    tableName: 'bookings',
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
  });
  return Bookings;
};