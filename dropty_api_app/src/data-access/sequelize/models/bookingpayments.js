'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingPayments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingPayments.belongsTo(models.Bookings, { foreignKey: 'bookingId', as: 'booking' });
      BookingPayments.hasOne(models.BookingPaymentRefund, { foreignKey: 'bookingPaymentId', as: 'refund' });
    }
  }
  BookingPayments.init({
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
      status: {
        type: DataTypes.ENUM(
          'pending',
          'authorized',
          'captured',
          'failed',
          'refunded',
          'partially_refunded',
          'canceled'
        ),
        allowNull: false,
        defaultValue: 'pending'
      },
      method: {
        type: DataTypes.ENUM(
          'card',
          'upi',
          'netbanking',
          'wallet',
          'cash',
          'bank_transfer',
          'cod'
        ),
        allowNull: false
      },
      gateway: {
        type: DataTypes.ENUM('razorpay', 'stripe', 'paypal', 'cash'),
        allowNull: false,
        defaultValue: 'razorpay'
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: true
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'INR'
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      capturedAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      statusLog: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: { "authorizedAt": null, "capturedAt": null, "failedAt": null, "refundedAt": null, "canceledAt": null }
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
    modelName: 'BookingPayments',
    tableName: 'booking_payments',
    timestamps: true,
    freezeTableName: true,
  });
  return BookingPayments;
};