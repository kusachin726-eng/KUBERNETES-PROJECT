'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking_addresses', {
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
      lead_passenger_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      flat_house_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      street_building: {
        type: Sequelize.STRING,
        allowNull: true
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      alternate_mobile: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      addressType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      totalDistanceKm: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      execessKm: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      execessKmFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: false
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coordinates: {
        type: Sequelize.GEOMETRY('POINT', 4326),
      },
       /**************************** Charge breakdown fields ************************************/
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
    await queryInterface.addIndex('booking_addresses', ['bookingId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('booking_addresses', ['bookingId']);
    await queryInterface.dropTable('booking_addresses');
  }
};