'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    static associate(models) {
      Vendor.hasMany(models.Vehicle, { foreignKey: 'vendorId', as: 'vehicles' });
      Vendor.hasMany(models.VehicleDriver, { foreignKey: 'vendorId', as: 'drivers' });
      Vendor.hasMany(models.BookingLogistics, { foreignKey: 'vendorId', as: 'bookings' });
    }
  }

  Vendor.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    vendorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendorCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contactPersonName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: false
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
    estimatedCommissionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Vendor',
    tableName: 'vendors',
    paranoid: true,
    timestamps: true
  });

  return Vendor;
};
