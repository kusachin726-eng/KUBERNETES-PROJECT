'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingFlightDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingFlightDetails.belongsTo(models.Bookings, { foreignKey: 'bookingId' });
    }
  }
  BookingFlightDetails.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    flightType: {
      type: DataTypes.ENUM('domestic', 'international'),
      allowNull: false
    },
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airportCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airportName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    terminal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
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
    modelName: 'BookingFlightDetails',
    tableName: 'booking_flight_details',
    timestamps: true,
    freezeTableName: true
  });
  return BookingFlightDetails;
};