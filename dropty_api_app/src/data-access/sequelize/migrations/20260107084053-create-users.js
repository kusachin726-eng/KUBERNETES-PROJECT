'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '+91'
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      otp_expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isMobileVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      user_type: {
        type: Sequelize.ENUM('admin', 'customer', 'crew', 'airport_manager', 'airport_crew','operations_manager','customer_service','driver'),
        allowNull: false,
        defaultValue: 'customer'
      },
      admin_role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'admin_roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    // Add index on mobile_number
    await queryInterface.addIndex('users', ['mobile_number']);
    // Add index on email
    await queryInterface.addIndex('users', ['email']);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', ['mobile_number']);
    await queryInterface.removeIndex('users', ['email']);
    
    await queryInterface.dropTable('users');
  }
};