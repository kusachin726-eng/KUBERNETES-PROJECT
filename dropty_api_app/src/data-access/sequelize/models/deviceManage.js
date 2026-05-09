"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class DeviceManage extends Model {
        static associate(models) {
            DeviceManage.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
        }
    }

    DeviceManage.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            auth_token: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            refresh_token: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            fcm_token: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            device_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            device_type: {
                type: DataTypes.ENUM("android", "ios", "web", "mobile", "desktop"),
                allowNull: false,
                defaultValue: "mobile",
            },
            device_info: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            last_active_at: {
                type: DataTypes.DATE,
                allowNull: true,
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
            }
        },
        {
            sequelize,
            modelName: "DeviceManage",
            tableName: "user_device_manages",
            timestamps: true,
            freezeTableName: true,
            paranoid: true,
        }
    );

    return DeviceManage;
};
