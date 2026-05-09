'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // define associations here
      Users.hasMany(models.DeviceManage, { foreignKey: "user_id", as: "devices" });
      Users.belongsTo(models.AdminRoles, { foreignKey: "admin_role_id", as: "adminRole" });
      Users.hasOne(models.UserProfile, { foreignKey: "userId", as: "userProfile" })
      Users.hasMany(models.Bookings, { foreignKey: 'passengerId', as: 'bookings' });
      Users.hasMany(models.BookingLogistics, { foreignKey: 'assignedCrewId', as: 'assignedLogistics' });
    }
  }

  Users.init(
    {
      country_code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '+91',
      },
      mobile_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isMobileVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_type: {
        type: DataTypes.ENUM('admin', 'customer', 'crew', 'airport_manager', 'airport_crew', 'operations_manager', 'customer_service', 'driver'),
        allowNull: false,
        defaultValue: 'customer'
      },
      admin_role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'admin_roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      roleChangeFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'users',
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
    }
  );
  
  const { forceLogout } = require("../../../sockets");

  Users.addHook("afterUpdate", async (user, options) => {
    // run only when role really changed
    if (!user.changed("admin_role_id")) return;

    console.log(`Role changed for user ${user.id}`);

    await user.update(
      { roleChangeFlag: false },
      { hooks: false }
    );

    forceLogout(user.id);
  });
  return Users;
};
