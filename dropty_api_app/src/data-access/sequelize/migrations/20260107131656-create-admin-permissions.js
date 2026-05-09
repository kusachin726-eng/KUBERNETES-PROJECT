'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'admin_roles',
          key: 'id'
        }
      },
      featureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'admin_role_features',
          key: 'id'
        }
      },
      canView: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canCreate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canEdit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      updateBy: {
        type: Sequelize.INTEGER
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
    // Add composite unique index on roleId and featureId
    await queryInterface.addIndex('admin_permissions', ['roleId']); 
    await queryInterface.addIndex('admin_permissions', ['featureId']);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('admin_permissions', ['roleId']);
    await queryInterface.removeIndex('admin_permissions', ['featureId']);

    await queryInterface.dropTable('admin_permissions');
  }
};