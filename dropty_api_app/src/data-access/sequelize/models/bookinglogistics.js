'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingLogistics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingLogistics.belongsTo(models.Bookings, { foreignKey: 'bookingId', as: 'booking' });
      BookingLogistics.belongsTo(models.Users, { foreignKey: 'assignedCrewId', as: 'assignedCrew' });
      BookingLogistics.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
      BookingLogistics.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
      BookingLogistics.belongsTo(models.VehicleDriver, { foreignKey: 'driverId', as: 'driver' });
    }
  }
  BookingLogistics.init({
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
      pickupDate: {
        type: DataTypes.DATEONLY
      },
      pickupTimeSlotStart: {
        type: DataTypes.TIME
      },
      pickupTimeSlotEnd: {
        type: DataTypes.TIME
      },
      assignedCrewId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'  
      },      
      pickupStartOTP: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pickupTimeStartByCrew: {
        type: DataTypes.TIME
      },      
      pickupCompletedOTP: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pickupTimeCompletedByCrew: {
        type: DataTypes.TIME
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'vehicles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'vehicle_drivers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      vendorCommissionAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
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
    modelName: 'BookingLogistics',
    tableName: 'booking_logistics',
    timestamps: true,
    freezeTableName: true
  });
  return BookingLogistics;
};