'use strict';
const {
  Model
} = require('sequelize');
module.exports = function AuditLogModel(sequelize, DataTypes) {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuditLog.belongsTo(models.Users, {foreignKey: "userId", as: "user"});
    }
  }
  AuditLog.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recordId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    oldData: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null
    },
    newData: {
      type: DataTypes.JSONB,
      allowNull: true,  
      defaultValue: null
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false      
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AuditLog',
    paranoid: true, // Enable soft deletes  
    tableName: 'audit_logs', // Explicitly specify the table name
    timestamps: true, // Enable createdAt and updatedAt
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name

  });
  return AuditLog;
};