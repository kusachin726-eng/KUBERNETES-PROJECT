'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      notificationId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      receiverUserType: {
        type: Sequelize.ENUM('CUSTOMER', 'PROVIDER'),
        allowNull: true
      },
      notificationEnum: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receiverUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      senderUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      body: {
        type: Sequelize.TEXT, // Changed to TEXT in case notification body is long
        allowNull: true
      },
      event: {
        type: Sequelize.STRING,  //"Reminder", "Requested", "Cancelled", "Completed", "Accepted", "Rejected", "Chat", "Credit", "Debit","Discount Offers", "Seasonal Offers", "Maintenance Alerts", "Referral", "New Arrival", "Festive Special", "custom"
        allowNull: true
      },
      fcmToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      scheduleTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deviceType: {
        type: Sequelize.ENUM('android', 'ios'),
        allowNull: true
      },
      notificationType: {
        type: Sequelize.ENUM('PUSH', 'INAPP', 'SMS', 'EMAIL'),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Booking', 'campaign', 'Wallet'),
        defaultValue: "Booking"
      },
      bookingId: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      firebaseResponse: {
        type: Sequelize.TEXT, // Changed to TEXT for potentially large JSON responses
        allowNull: true
      },
      errorMessage: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      url: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('SENT', 'CANCEL', 'SCHEDULED', 'INACTIVE', 'QUEUED', 'FAILED'),
        allowNull: false
      },
      readStatus: {
        type: Sequelize.ENUM('READ', 'UNREAD'),
        defaultValue: 'UNREAD'
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

      // Add indexes for performance optimization
      await queryInterface.addIndex('notification_logs', ['receiverUserId']);
      await queryInterface.addIndex('notification_logs', ['receiverUserType']);
      await queryInterface.addIndex('notification_logs', ['status']);
      await queryInterface.addIndex('notification_logs', ['readStatus']);
      await queryInterface.addIndex('notification_logs', ['createdAt']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notification_logs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_logs_receiverUserType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_logs_deviceType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_logs_notificationType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_logs_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notification_logs_readStatus";');
  }
};