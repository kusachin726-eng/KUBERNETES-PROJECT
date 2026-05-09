'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vehicleRegistrationNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'License plate / Registration number'
      },
      vehicleModel: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'e.g., Mahindra Bolero, Tata 407, etc.'
      },
      capacityKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Maximum load capacity in kg'
      },
      capacityVolumeCubicMeter: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Maximum volume capacity in cubic meters'
      },
      acquisitionDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      insuranceExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      pollutionCertificateExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      lastMaintenanceDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      nextMaintenanceDueDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('available', 'booked', 'maintenance', 'inactive'),
        allowNull: false,
        defaultValue: 'available'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Add indexes
    await queryInterface.addIndex('vehicles', ['vendorId']);
    await queryInterface.addIndex('vehicles', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
  }
};
