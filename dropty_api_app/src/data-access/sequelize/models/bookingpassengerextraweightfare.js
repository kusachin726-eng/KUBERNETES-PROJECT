'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingPassengerExtraWeightFare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingPassengerExtraWeightFare.belongsTo(models.BookingPassengers, {
        foreignKey: 'bookingPassengerId',
        as: 'bookingPassenger'
      });
      BookingPassengerExtraWeightFare.belongsTo(models.AirlineExtraBagFare, {
        foreignKey: 'airlineExtraBagFareId',
        as: 'airlineExtraBagFare'
      });
    }
  }
  BookingPassengerExtraWeightFare.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingPassengerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'booking_passengers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    airlineExtraBagFareId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'airline_extra_bag_fares',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    extraWeightKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    extraWeightFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
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
    modelName: 'BookingPassengerExtraWeightFare',
    tableName: 'booking_passenger_extra_weight_fares',
    timestamps: true,
    freezeTableName: true
  });
  return BookingPassengerExtraWeightFare;
};