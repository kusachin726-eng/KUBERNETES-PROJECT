'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('airline_extra_bag_fares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airlineId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'airlines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      flightType: {
        type: Sequelize.ENUM('domestic', 'international'),
        allowNull: false
      },
      baggageType: {
        type: Sequelize.ENUM('bag','weight'),
        allowNull: false
      },
      additionalKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      additionalKgFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });    
    await queryInterface.addIndex('airline_extra_bag_fares', ['airlineId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('airline_extra_bag_fares', ['airlineId']);
    await queryInterface.dropTable('airline_extra_bag_fares');
  }
};