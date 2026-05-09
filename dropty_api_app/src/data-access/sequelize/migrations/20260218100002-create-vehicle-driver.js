'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicle_drivers', {
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
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Driving License Number'
      },
      licenseExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      aadharNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      addressLine2: {
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
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankIFSC: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankAccountHolder: {
        type: Sequelize.STRING,
        allowNull: true
      },
      experienceYears: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyContactPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('available', 'on-trip', 'on-break', 'inactive'),
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
    await queryInterface.addIndex('vehicle_drivers', ['vendorId']);
    await queryInterface.addIndex('vehicle_drivers', ['status']);
    await queryInterface.addIndex('vehicle_drivers', ['licenseNumber']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicle_drivers');
  }
};
