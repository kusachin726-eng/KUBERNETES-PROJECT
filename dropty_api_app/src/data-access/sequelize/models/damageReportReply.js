'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DamageReportReply extends Model {
        static associate(models) {
            DamageReportReply.belongsTo(models.DamageBaggageReport, { foreignKey: 'damageReportId', as: 'report' });
            DamageReportReply.belongsTo(models.Users, { foreignKey: 'repliedBy', as: 'admin' });
            DamageReportReply.hasMany(models.DamageReportImage, { foreignKey: 'replyId', as: 'images' });
        }
    }
    DamageReportReply.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        damageReportId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'booking_damage_baggage_reports',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        repliedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        },
        replyMessage: {
            type: DataTypes.TEXT,
            allowNull: false
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
        modelName: 'DamageReportReply',
        tableName: 'booking_damage_report_replies',
        timestamps: true
    });
    return DamageReportReply;
};
