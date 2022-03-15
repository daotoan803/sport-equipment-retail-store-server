const Order = require('../models/order.model');
const OrderGroup = require('../models/order-group.model');
const Product = require('../models/product.model');
const sequelizeConnection = require('../models/db-connection');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const productService = require('./product.service');

const generateOrderGroupFilter = (filterOption = {}) => {
  if (Object.keys(filterOption).length === 0) return {};
  const option = {};
  const { page, limit, state } = filterOption;
  if (page && limit) {
    option.offset = (page - 1) * limit;
    option.limit = limit;
  }

  if (state) {
    option.where = { state: OrderGroup.state[state] };
  }

  return option;
};

const checkOrderGroupBelongToUser = (orderGroup, userId) => {
  if (orderGroup.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User don't have permission to update this order"
    );
  }
};

const checkAllProductInOrderIsAvailableAndGetProducts = async (products) => {
  return [
    ...(await Promise.all(
      products.map(async ({ productId, quantity, price }) => {
        const product = await Product.findByPk(productId);
        if (!product) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            `Product id: ${productId} not exists`
          );
        }
        if (product.state !== Product.state.available) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Product ${product.title} is not available for sell`
          );
        }
        if (product.availableQuantity < quantity) {
          throw new ApiError(
            httpStatus.CONFLICT,
            `${product.id} only has ${product.availableQuantity} in stock`
          );
        }
        if (product.price !== price && product.discountPrice !== price) {
          throw new ApiError(
            httpStatus.CONFLICT,
            `${productId} has changed price, please reload and try again`
          );
        }
        product.quantity = quantity;
        return product;
      })
    )),
  ];
};

const findOrderGroupById = async (orderGroupId, options = {}) => {
  const orderGroup = OrderGroup.findByPk(orderGroupId, options);
  if (!orderGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order group id not exists');
  }
  return orderGroup;
};

const createOrder = async (
  userId,
  { address, phoneNumber, note, products: productInOrders }
) => {
  const products = await checkAllProductInOrderIsAvailableAndGetProducts(
    productInOrders
  );

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const transaction = await sequelizeConnection.transaction();
  try {
    const orderGroup = await OrderGroup.create(
      {
        state: OrderGroup.state.new,
        address,
        phoneNumber,
        note,
        totalPrice,
        userId,
      },
      { transaction }
    );

    const orders = await Order.bulkCreate(
      products.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      { transaction }
    );

    await orderGroup.addOrders(orders, { transaction });
    await transaction.commit();

    products.forEach((product) => {
      productService.updateProductAvailableQuantity(
        product.id,
        -product.quantity
      );
    });

    orderGroup.dataValues.orders = orders;

    return orderGroup;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

const updateOrderGroupContact = async (
  orderGroupId,
  userId,
  { address, phoneNumber }
) => {
  const orderGroup = await findOrderGroupById(orderGroupId, { include: Order });
  checkOrderGroupBelongToUser(orderGroup, userId);
  if (orderGroup.state !== OrderGroup.state.new) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Order contact can only be update when order state is new'
    );
  }
  orderGroup.address = address;
  orderGroup.phoneNumber = phoneNumber;
  return orderGroup.save();
};

const updateOrderGroupState = async (orderGroupId, { state }) => {
  if (state === OrderGroup.state.canceled)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Can't cancel order with this request"
    );

  const orderGroup = await findOrderGroupById(orderGroupId);
  orderGroup.state = state;
  return orderGroup.save();
};

const cancelOrder = async (orderGroupId, userId, { reason }) => {
  const orderGroup = await findOrderGroupById(orderGroupId, { include: Order });
  checkOrderGroupBelongToUser(orderGroup, userId);
  if (orderGroup.state !== OrderGroup.state.new)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Order can only be cancel when order's state is new"
    );

  orderGroup.orders.forEach((product) => {
    productService.updateProductAvailableQuantity(
      product.productId,
      product.quantity
    );
  });

  orderGroup.state = OrderGroup.state.canceled;
  orderGroup.reason = reason;
  return orderGroup.save();
};

const getOrderGroups = async ({ state, page, limit }) => {
  const filterOption = generateOrderGroupFilter({ state, page, limit });
  return OrderGroup.findAll({
    ...filterOption,
    order: [['createdAt', 'ASC']],
    include: Order,
  });
};

const getOrderGroupsByUser = async (userId, { page, limit }) => {
  const filterOption = generateOrderGroupFilter({ page, limit });
  filterOption.where = filterOption.where || {};
  filterOption.where.userId = userId;
  return OrderGroup.findAll({
    ...filterOption,
    order: [['createdAt', 'ASC']],
    include: Order,
  });
};

module.exports = {
  createOrder,
  updateOrderGroupContact,
  updateOrderGroupState,
  getOrderGroups,
  getOrderGroupsByUser,
  cancelOrder,
};
