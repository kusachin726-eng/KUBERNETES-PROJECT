'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airlines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airlines.hasMany(models.Bookings, { foreignKey: 'airlineId', as: 'bookings' });
      Airlines.hasMany(models.AirlineExtraBagFare, { foreignKey: 'airlineId', as: 'extraBagFares' });
    }
  }
  Airlines.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      airlineName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      airlineLogo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE
      }
  }, {
    sequelize,
    modelName: 'Airlines',
    tableName: 'airlines',
    paranoid: true,
    timestamps: true,
    freezeTableName: true
  });
  return Airlines;
};