const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");
const { v4: uuidv4 } = require("uuid");

const TurfOwner = sequelize.define("TurfOwner", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  turfIds: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idProof: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentInfo: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: false,
  },
});

module.exports = TurfOwner;
