'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'cities', 
      'stateCode',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'cities', 
      'pincode', 
      {
        type: Sequelize.JSONB,  // Storing multiple pincodes as an array in JSONB format exaple: [ "560001", "560002" ]
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('cities', 'stateCode');
    await queryInterface.removeColumn('cities', 'pincode');
  }
};
