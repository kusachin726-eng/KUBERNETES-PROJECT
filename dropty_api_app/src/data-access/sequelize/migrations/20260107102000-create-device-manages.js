'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_device_manages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            auth_token: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            refresh_token: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            fcm_token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            device_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            device_type: {
                type: Sequelize.ENUM('android', 'ios', 'web', 'mobile', 'desktop'),
                allowNull: false,
                defaultValue: 'mobile'
            },
            device_info: {
                type: Sequelize.JSON,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            last_active_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        // Indexes
        await queryInterface.addIndex('user_device_manages', ['user_id'], { name: 'idx_device_user' });
        await queryInterface.addIndex('user_device_manages', ['device_id'], { name: 'idx_device_deviceid' });
        await queryInterface.addIndex('user_device_manages', ['fcm_token'], { name: 'idx_device_fcm_token' });
        await queryInterface.addIndex('user_device_manages', ['is_active'], { name: 'idx_device_is_active' });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('user_device_manages', 'idx_device_user');
        await queryInterface.removeIndex('user_device_manages', 'idx_device_deviceid');
        await queryInterface.removeIndex('user_device_manages', 'idx_device_firebase');
        await queryInterface.removeIndex('user_device_manages', 'idx_device_is_active');

        await queryInterface.dropTable('user_device_manages');
    }
};
