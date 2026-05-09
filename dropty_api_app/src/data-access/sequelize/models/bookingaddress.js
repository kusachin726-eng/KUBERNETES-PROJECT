'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingAddress.belongsTo(models.Bookings, { foreignKey: 'bookingId', as: 'booking' });
    }
  }
  BookingAddress.init({
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
      lead_passenger_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      flat_house_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      street_building: {
        type: DataTypes.STRING,
        allowNull: true
      },
      landmark: {
        type: DataTypes.STRING,
        allowNull: true
      },
      alternate_mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      addressType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      totalDistanceKm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      execessKm: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      execessKmFare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false
      },
      coordinates: {
        type: DataTypes.GEOMETRY('POINT', 4326),
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
    modelName: 'BookingAddress',
    tableName: 'booking_addresses',
    timestamps: true,
    freezeTableName: true
  });
  return BookingAddress;
};