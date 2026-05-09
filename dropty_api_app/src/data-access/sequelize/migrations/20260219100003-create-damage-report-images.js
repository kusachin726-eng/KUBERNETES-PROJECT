'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('booking_damage_report_images', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            damageReportId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'booking_damage_baggage_reports',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            replyId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'booking_damage_report_replies',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            imageUrl: {
                type: Sequelize.JSONB,
                allowNull: false,
                defaultValue: []

            },
            type: {
                type: Sequelize.ENUM('initial-report', 'reply'),
                allowNull: false,
                defaultValue: 'initial-report'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addIndex('booking_damage_report_images', ['damageReportId']);
        await queryInterface.addIndex('booking_damage_report_images', ['replyId']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('booking_damage_report_images');
    }
};
