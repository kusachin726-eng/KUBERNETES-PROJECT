'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notifications.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING(1000), // Allowing for longer notification bodies
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
      defaultValue: 'medium'
    },
    redirectPageValue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('INAPP', 'PUSH'),
      allowNull: false,
      defaultValue: 'INAPP'
    },
    dynamicField: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notificationEnum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delayTime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referenceType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    event: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Notifications',
    tableName: 'notifications',   // 👈 IMPORTANT
    freezeTableName: true,        // 👈 prevents auto pluralization
    paranoid: true 
  });
  return Notifications;
};