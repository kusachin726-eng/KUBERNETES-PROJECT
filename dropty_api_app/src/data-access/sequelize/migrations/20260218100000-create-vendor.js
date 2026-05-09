'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vendorCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      contactPersonName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contactEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      contactPhone: {
        type: Sequelize.STRING,
        allowNull: false
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
      estimatedCommissionPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Commission percentage for each booking'
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendors');
  }
};
