'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_logistics', {
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
      pickupDate: {
        type: Sequelize.DATEONLY
      },
      pickupTimeSlotStart: {
        type: Sequelize.TIME
      },
      pickupTimeSlotEnd: {
        type: Sequelize.TIME
      },
      assignedCrewId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'  
      },      
      pickupStartOTP: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pickupTimeStartByCrew: {
        type: Sequelize.TIME
      },      
      pickupCompletedOTP: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pickupTimeCompletedByCrew: {
        type: Sequelize.TIME
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
    await queryInterface.addIndex('booking_logistics', ['bookingId']);
    await queryInterface.addIndex('booking_logistics', ['assignedCrewId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('booking_logistics', ['bookingId']);
    await queryInterface.removeIndex('booking_logistics', ['assignedCrewId']);
    await queryInterface.dropTable('booking_logistics');
  }
};