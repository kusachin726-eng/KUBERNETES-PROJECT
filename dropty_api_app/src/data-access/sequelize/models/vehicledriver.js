'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VehicleDriver extends Model {
    static associate(models) {
      VehicleDriver.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
      VehicleDriver.hasMany(models.BookingLogistics, { foreignKey: 'driverId', as: 'bookings' });
    }
  }

  VehicleDriver.init({
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    licenseExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    addressLine2: {
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
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankIFSC: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bankAccountHolder: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'on-trip', 'on-break', 'inactive'),
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
    modelName: 'VehicleDriver',
    tableName: 'vehicle_drivers',
    paranoid: true,
    timestamps: true
  });

  return VehicleDriver;
};
