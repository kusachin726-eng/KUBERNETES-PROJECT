'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingPaymentRefund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingPaymentRefund.belongsTo(models.BookingPayments, { foreignKey: 'bookingPaymentId', as: 'bookingPayment' });
    }
  }
  BookingPaymentRefund.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      bookingPaymentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'booking_payments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      refundId: {
        type: DataTypes.STRING,
        allowNull: true
      },

      refundReason: {
        type: DataTypes.STRING,
        allowNull: true
      },

      refundStatus: {
        type: DataTypes.ENUM(
          'pending',
          'processed',
          'failed'
        ),
        allowNull: true
      },      
      refundedAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      refundedAt: {
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
      }
  }, {
    sequelize,
    modelName: 'BookingPaymentRefund',
    tableName: 'booking_payment_refunds',
    timestamps: true,
    freezeTableName: true,
  });
  return BookingPaymentRefund;
};