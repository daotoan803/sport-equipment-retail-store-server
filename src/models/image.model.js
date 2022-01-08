const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./config/db');

class Image extends Model {}

Image.init(
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'image',
  }
);

module.exports = Image;
