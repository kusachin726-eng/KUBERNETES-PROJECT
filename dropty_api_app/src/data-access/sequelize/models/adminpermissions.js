'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AdminPermissions.belongsTo(models.AdminRoles, { foreignKey: "roleId", as: "role" });
      AdminPermissions.belongsTo(models.AdminRoleFeatures, { foreignKey: "featureId", as: "feature" });
    }
  }
  AdminPermissions.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'admin_roles',
          key: 'id'
        }
      },
      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'admin_role_features',
          key: 'id'
        }
      },
      canView: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canCreate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canEdit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      canDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdBy: {
        type: DataTypes.INTEGER
      },
      updateBy: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {
    sequelize,
    modelName: 'AdminPermissions',
    tableName: 'admin_permissions',
    timestamps: true,
    freezeTableName: true,
  });
  return AdminPermissions;
};