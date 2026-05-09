'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AirlineExtraBagFare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AirlineExtraBagFare.belongsTo(models.Airlines, { foreignKey: 'airlineId', as: 'airline' });
    }
  }
  AirlineExtraBagFare.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    airlineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'airlines',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    flightType: {
      type: DataTypes.ENUM('domestic', 'international'),
      allowNull: false
    },
    baggageType: {
      type: DataTypes.ENUM('bag', 'weight'),
      allowNull: false
    },
    additionalKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    additionalKgFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
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
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AirlineExtraBagFare',
    tableName: 'airline_extra_bag_fares',
    paranoid: true,
    timestamps: true
  });
  return AirlineExtraBagFare;
};