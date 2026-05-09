'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_payment_refunds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingPaymentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'booking_payments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      refundId: {
        type: Sequelize.STRING,
        allowNull: true
      },

      refundReason: {
        type: Sequelize.STRING,
        allowNull: true
      },

      refundStatus: {
        type: Sequelize.ENUM(
          'pending',
          'processed',
          'failed'
        ),
        allowNull: true
      },      
      refundedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      refundedAt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('booking_payment_refunds', ['bookingPaymentId']);
    await queryInterface.addIndex('booking_payment_refunds', ['refundStatus']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('booking_payment_refunds', ['bookingPaymentId']);
    await queryInterface.removeIndex('booking_payment_refunds', ['refundStatus']);
    await queryInterface.dropTable('booking_payment_refunds');
  }
};