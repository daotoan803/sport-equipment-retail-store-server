const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./db');
const _ = require('lodash');

class Product extends Model {
  static state = {
    available: 'available',
    outStock: 'outStock',
    hidden: 'hidden',
  };
}

Product.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('title', _.capitalize(value.trim()));
      },
      validate: {
        len: {
          args: [[4, 50]],
          msg: 'Product title must be between 4 and 50 characters',
        },
      },
    },

    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isDecimal: {
          args: true,
          msg: 'Product price must be a number',
        },
        min: {
          args: 0,
          msg: "Product price can't be negative",
        },
      },
    },

    promotionPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,

      validate: {
        isDecimal: {
          args: true,
          msg: 'Product promotion price must be a number',
        },
        min: {
          args: 0,
          msg: "Product promotion price can't be negative",
        },
      },
    },

    warrantyPeriodByDay: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        isInt: {
          args: true,
          msg: 'Invalid warranty period by day value, must be an integer and greater than 0',
        },
        min: {
          args: 0,
          msg: 'Invalid warranty period by day value, must be an integer and greater than 0',
        },
      },
    },

    availableQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: "Product available quantity can't be negative",
        },
        isInt: {
          args: 0,
          msg: 'Product available quantity must be an integer',
        },
      },
    },

    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: Product.state.hidden,
      validate: {
        isIn: {
          args: [Object.values(Product.state)],
          msg: `Invalid product state, only accept : ${Object.values(
            Product.state
          ).join(', ')}`,
        },
      },
    },
  },

  {
    sequelize: sequelizeConnection,
    modelName: 'product',
    paranoid: true,
  }
);

module.exports = Product;
