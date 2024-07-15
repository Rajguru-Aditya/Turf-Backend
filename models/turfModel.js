const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");
const { v4: uuidv4 } = require("uuid");

const Turf = sequelize.define(
  "Turf",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sports: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    availableSports: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    facilities: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    equipments: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    days: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    timings: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    rules: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    paymentInfo: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "turf_db",
  }
);

module.exports = Turf;
