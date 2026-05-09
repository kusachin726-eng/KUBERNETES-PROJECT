'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DamageReportImage extends Model {
        static associate(models) {
            DamageReportImage.belongsTo(models.DamageBaggageReport, { foreignKey: 'damageReportId', as: 'report' });
            DamageReportImage.belongsTo(models.DamageReportReply, { foreignKey: 'replyId', as: 'reply' });
        }
    }
    DamageReportImage.init({
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
        replyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'booking_damage_report_replies',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        imageUrl: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: []
        },
        type: {
            type: DataTypes.ENUM('initial-report', 'reply'),
            allowNull: false,
            defaultValue: 'initial-report'
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'DamageReportImage',
        tableName: 'booking_damage_report_images',
        timestamps: false
    });
    return DamageReportImage;
};
