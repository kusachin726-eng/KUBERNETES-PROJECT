'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      passengerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pnr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      airlineId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'airlines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      emailOrLastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      /**************************************************************** */
      totalAllowedBaggageWeightKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },      
      totalExcessBaggageWeightKg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      totalExcessBaggageFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      /************************************************************ */
      extraBags: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalExtraBagFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      totalBags: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      airlineTotalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      
      excessKmFare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      /**************************** Charge breakdown fields ************************************/
      

      convenienceFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      platformFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      }, 
      couponId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalDiscount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      usedCoinAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      totalGST: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },

      // Cancellation details
      canceledBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', 
        allowNull: true
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cancellationDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('bookings', ['passengerId']);
    await queryInterface.addIndex('bookings', ['pnr']);
    await queryInterface.addIndex('bookings', ['airlineId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('bookings', ['passengerId']);
    await queryInterface.removeIndex('bookings', ['pnr']);
    await queryInterface.removeIndex('bookings', ['airlineId']);

    await queryInterface.dropTable('bookings');
  }
};