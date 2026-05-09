'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingPassengers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingPassengers.belongsTo(models.Bookings, {
        foreignKey: 'bookingId',
        as: 'booking'
      });
      BookingPassengers.hasMany(models.BookingPassengerExtraWeightFare, {
        foreignKey: 'bookingPassengerId',
        as: 'extraWeightFares'
      });
    }
  }
  BookingPassengers.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    passengerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passengerType: {
      type: DataTypes.ENUM('ADULT', 'CHILD', 'INFANT'),
      allowNull: true
    },

    allowedBaggageWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    excessBaggageWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    excessBaggageFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    allowedBagCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    excessBagCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    excessBagFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    metaData: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'BookingPassengers',
    tableName: 'booking_passengers',
    timestamps: true,
    freezeTableName: true,
  });
  return BookingPassengers;
};