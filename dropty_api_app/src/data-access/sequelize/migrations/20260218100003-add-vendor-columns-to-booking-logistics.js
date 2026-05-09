'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('booking_logistics', 'vendorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('booking_logistics', 'vehicleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'vehicles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('booking_logistics', 'driverId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'vehicle_drivers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('booking_logistics', 'vendorCommissionAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      comment: 'Commission amount to be paid to vendor'
    });

    // Add indexes
    await queryInterface.addIndex('booking_logistics', ['vendorId']);
    await queryInterface.addIndex('booking_logistics', ['vehicleId']);
    await queryInterface.addIndex('booking_logistics', ['driverId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('booking_logistics', 'vendorId');
    await queryInterface.removeColumn('booking_logistics', 'vehicleId');
    await queryInterface.removeColumn('booking_logistics', 'driverId');
    await queryInterface.removeColumn('booking_logistics', 'vendorCommissionAmount');
  }
};
