const { Model, DataTypes } = require('sequelize');

const sequelizeConnection = require('./config/db');
const _ = require('lodash');

class Product extends Model {
  static state = {
    available: 'available',
    outStock: 'outStock',
    hidden: 'hidden',
  };

  static async isTitleExists(title) {
    const product = await Product.findOne({ where: { title } });
    if (product) return true;
    return false;
  }

  static createProduct = async () => {
    
  }

}

Product.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('title', _.capitalize(value.trim()));
      },
      unique: true,
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
      set(value) {
        this.setDataValue('price', Number(value));
      },
      validate: {
        isDecimal: {
          msg: 'Product price must be a number',
        },
        min: {
          args: [0],
          msg: "Product price can't be negative",
        },
      },
    },

    discountPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      set(value) {
        this.setDataValue('discountPrice', Number(value));
      },
      validate: {
        isDecimal: {
          msg: 'Product discount price must be a number',
        },
        min: {
          args: [0],
          msg: "Product discount price can't be negative",
        },
      },
    },

    warrantyPeriodByDay: {
      type: DataTypes.INTEGER,
      allowNull: false,

      set(value) {
        this.setDataValue('warrantyPeriodByDay', Number(value));
      },
      validate: {
        isInt: {
          msg: 'Invalid warranty period by day value, must be an integer and greater than 0',
        },
        min: {
          args: [0],
          msg: 'Invalid warranty period by day value, must be an integer and greater than 0',
        },
      },
    },

    availableQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
      set(value) {
        this.setDataValue('availableQuantity', Number(value));
      },
      validate: {
        min: {
          args: [0],
          msg: "Product available quantity can't be negative",
        },
        isInt: {
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
