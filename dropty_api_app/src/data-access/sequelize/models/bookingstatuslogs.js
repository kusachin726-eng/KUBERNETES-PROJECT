'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingStatusLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingStatusLogs.belongsTo(models.Bookings, { foreignKey: 'bookingId', as: 'booking' });
    }
  }
  BookingStatusLogs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    previousStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    newStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
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
    modelName: 'BookingStatusLogs',
    tableName: 'booking_status_logs',
    timestamps: true,
    freezeTableName: true,
  });
  return BookingStatusLogs;
};