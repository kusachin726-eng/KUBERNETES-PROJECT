'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('bookings', 'fare_breakup', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.addColumn('bookings', 'cgst', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('bookings', 'sgst', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('bookings', 'igst', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('bookings', 'fare_breakup');
    await queryInterface.removeColumn('bookings', 'cgst');
    await queryInterface.removeColumn('bookings', 'sgst');
    await queryInterface.removeColumn('bookings', 'igst');
  }
};
