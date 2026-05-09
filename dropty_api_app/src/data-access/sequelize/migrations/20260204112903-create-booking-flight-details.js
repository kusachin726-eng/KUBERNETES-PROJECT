'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_flight_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',  
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      flightType: {
        type: Sequelize.ENUM('domestic', 'international'),
        allowNull: false
      },
      flightNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      airportCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      airportName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      terminal: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
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
    await queryInterface.addIndex('booking_flight_details', ['bookingId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking_flight_details');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_BookingFlightDetails_flightType";');
  }
};