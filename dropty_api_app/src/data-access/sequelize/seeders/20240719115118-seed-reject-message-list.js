'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reject_message_list', [
      {
        title: 'Service unavailable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Fully booked',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Out of service area',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add more reject messages as needed
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reject_message_list', null, {});
  }
};
