'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      body: {
        type: Sequelize.STRING(1000), // Allowing for longer notification bodies
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        allowNull: false,
        defaultValue: 'medium'
      },
      redirectPageValue: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('INAPP', 'PUSH'),
        allowNull: false,
        defaultValue: 'INAPP'
      },
      dynamicField: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notificationEnum: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delayTime: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      referenceType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      event: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notifications_priority";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notifications_type";');
  }
};