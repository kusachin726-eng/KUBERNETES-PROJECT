'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      Vehicle.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
      Vehicle.hasMany(models.BookingLogistics, { foreignKey: 'vehicleId', as: 'bookings' });
    }
  }

  Vehicle.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    vehicleRegistrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    vehicleModel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacityKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    capacityVolumeCubicMeter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    acquisitionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    insuranceExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    pollutionCertificateExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    lastMaintenanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nextMaintenanceDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'booked', 'maintenance', 'inactive'),
      allowNull: false,
      defaultValue: 'available'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    paranoid: true,
    timestamps: true
  });

  return Vehicle;
};
