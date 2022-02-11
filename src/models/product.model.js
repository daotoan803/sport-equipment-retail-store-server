const sequelize = require('sequelize');
const { Model, DataTypes } = sequelize;

const sequelizeConnection = require('../../config/database.config');

class Product extends Model {
  static state = {
    available: 'available',
    outStock: 'outStock',
    hidden: 'hidden',
  };

  static sortOptions = {
    name: ['title', 'ASC'],
    priceAsc: [
      sequelize.fn(
        'IFNULL',
        sequelize.col('discountPrice'),
        sequelize.col('price')
      ),
      'ASC',
    ],
    priceDesc: [
      sequelize.fn(
        'IFNULL',
        sequelize.col('discountPrice'),
        sequelize.col('price')
      ),
      'DESC',
    ],
    mostVisited: ['visitedCount', 'DESC'],
    mostSold: ['soldCount', 'DESC'],
  };

  static async isTitleExists(title) {
    const product = await Product.findOne({
      where: {
        title: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('title')),
          '=',
          title.trim().toLowerCase()
        ),
      },
    });
    if (product) return true;
    return false;
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('title', value.trim());
      },
      unique: true,
      validate: {
        len: {
          args: [[4, 100]],
          msg: 'Product title must be between 4 and 100 characters',
        },
      },
    },

    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
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
        this.setDataValue('discountPrice', value ? Number(value) : null);
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

    soldCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    visitedCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
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

    mainImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize: sequelizeConnection,
    modelName: 'product',
    paranoid: true,
  }
);

module.exports = Product;
