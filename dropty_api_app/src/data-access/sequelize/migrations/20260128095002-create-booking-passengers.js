'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_passengers', {
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
      passengerName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      passengerType: {
        type: Sequelize.ENUM('ADULT', 'CHILD', 'INFANT'),
        allowNull: true
      },

      allowedBaggageWeightKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      excessBaggageWeightKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      excessBaggageFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      allowedBagCount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      excessBagCount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      excessBagFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      
      metaData: {
        type: Sequelize.JSONB,
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
    await queryInterface.addIndex('booking_passengers', ['bookingId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('booking_passengers', ['bookingId']);
    await queryInterface.dropTable('booking_passengers');
  }
};