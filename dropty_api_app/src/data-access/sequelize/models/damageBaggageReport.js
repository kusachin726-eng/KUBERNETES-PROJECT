'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DamageBaggageReport extends Model {
        static associate(models) {
            DamageBaggageReport.belongsTo(models.Bookings, { foreignKey: 'bookingId', as: 'booking' });
            DamageBaggageReport.belongsTo(models.Users, { foreignKey: 'customerId', as: 'customer' });
            DamageBaggageReport.hasMany(models.DamageReportImage, { foreignKey: 'damageReportId', as: 'images' });
            DamageBaggageReport.hasMany(models.DamageReportReply, { foreignKey: 'damageReportId', as: 'replies' });
        }
    }
    DamageBaggageReport.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        damageType: {
            type: DataTypes.ENUM('baggage', 'other'),
            allowNull: false,
            defaultValue: 'baggage'
        },
        baggageDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        damageDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        severity: {
            type: DataTypes.ENUM('minor', 'moderate', 'major'),
            allowNull: false,
            defaultValue: 'major'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('reported', 'under-review', 'resolved', 'rejected'),
            allowNull: false,
            defaultValue: 'reported'
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
        modelName: 'DamageBaggageReport',
        tableName: 'booking_damage_baggage_reports',
        timestamps: true
    });
    return DamageBaggageReport;
};
