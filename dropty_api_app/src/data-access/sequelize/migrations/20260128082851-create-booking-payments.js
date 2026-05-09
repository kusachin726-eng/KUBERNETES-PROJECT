'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM('razorpay', 'stripe', 'paypal', 'cash'),
        allowNull: false,
        defaultValue: 'razorpay'
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      signature: {
        type: Sequelize.STRING,
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'INR'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      capturedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      statusLog: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: { "authorizedAt": null, "capturedAt": null, "failedAt": null, "refundedAt": null, "canceledAt": null }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // index
    await queryInterface.addIndex('booking_payments', ['bookingId']);
    await queryInterface.addIndex('booking_payments', ['status']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('booking_payments', ['bookingId']);
    await queryInterface.removeIndex('booking_payments', ['status']);
    await queryInterface.dropTable('booking_payments');
  }
};