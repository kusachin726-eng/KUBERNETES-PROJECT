'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NotificationLog.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    notificationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiverUserType: {
      type: DataTypes.ENUM('CUSTOMER', 'PROVIDER'),
      allowNull: true
    },
    notificationEnum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receiverUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    senderUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT, // Changed to TEXT in case notification body is long
      allowNull: true
    },
    event: {
      type: DataTypes.STRING,  //"Reminder", "Requested", "Cancelled", "Completed", "Accepted", "Rejected", "Chat", "Credit", "Debit","Discount Offers", "Seasonal Offers", "Maintenance Alerts", "Referral", "New Arrival", "Festive Special", "custom"
      allowNull: true
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scheduleTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deviceType: {
      type: DataTypes.ENUM('android', 'ios'),
      allowNull: true
    },
    notificationType: {
      type: DataTypes.ENUM('PUSH', 'INAPP', 'SMS', 'EMAIL'),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Booking', 'campaign', 'Wallet'),
      defaultValue: "Booking"
    },
    bookingId: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    firebaseResponse: {
      type: DataTypes.TEXT, // Changed to TEXT for potentially large JSON responses
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    url: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM('SENT', 'CANCEL', 'SCHEDULED', 'INACTIVE', 'QUEUED', 'FAILED'),
      allowNull: false
    },
    readStatus: {
      type: DataTypes.ENUM('READ', 'UNREAD'),
      defaultValue: 'UNREAD'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'NotificationLog',
    tableName: 'notification_logs',
    freezeTableName: true,
    paranoid: true, 
    indexes: [
      {
        fields: ['receiverUserId']
      },
      {
        fields: ['receiverUserType']
      },
      {
        fields: ['status']
      },
      {
        fields: ['readStatus']
      },
      {
        fields: ['createdAt']
      }
    ] 
  });
  return NotificationLog;
};