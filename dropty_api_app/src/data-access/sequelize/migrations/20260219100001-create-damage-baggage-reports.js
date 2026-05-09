'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('booking_damage_baggage_reports', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'bookings',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            customerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            damageType: {
                type: Sequelize.ENUM('baggage', 'other'),
                allowNull: false,
                defaultValue: 'baggage'
            },
            baggageDescription: {
                type: Sequelize.STRING,
                allowNull: true
            },
            damageDescription: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            severity: {
                type: Sequelize.ENUM('minor', 'moderate', 'major'),
                allowNull: false,
                defaultValue: 'major'
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('reported', 'under-review', 'resolved', 'rejected'),
                allowNull: false,
                defaultValue: 'reported'
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

        await queryInterface.addIndex('booking_damage_baggage_reports', ['bookingId']);
        await queryInterface.addIndex('booking_damage_baggage_reports', ['customerId']);
        await queryInterface.addIndex('booking_damage_baggage_reports', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('booking_damage_baggage_reports');
    }
};
