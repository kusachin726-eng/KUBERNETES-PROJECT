'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tableName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      recordId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      oldData: {
        allowNull: true,
        type: Sequelize.JSONB,
        defaultValue: null
      },
      newData: {
        allowNull: true,
        type: Sequelize.JSONB,
        defaultValue: null
      },
      ipAddress: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userAgent: {
        allowNull: true,
        type: Sequelize.TEXT
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
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    // Add indexes for better query performance
    await queryInterface.addIndex('audit_logs', ['userId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
  }
};