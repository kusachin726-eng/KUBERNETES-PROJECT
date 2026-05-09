'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('booking_damage_report_replies', {
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
            repliedBy: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            },
            replyMessage: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addIndex('booking_damage_report_replies', ['damageReportId']);
        await queryInterface.addIndex('booking_damage_report_replies', ['repliedBy']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('booking_damage_report_replies');
    }
};
