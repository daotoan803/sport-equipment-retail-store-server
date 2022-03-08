const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const categoryService = require('./category.service');

const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const Product = require('../models/product.model');

const findBrandById = async (brandId, option = {}) => {
  const brand = await Brand.findByPk(brandId, option);
  if (!brand) throw new ApiError(httpStatus.NOT_FOUND, 'Brand id not exists');
  return brand;
};

const checkBrandNameExists = async (name) => {
  if (await Brand.isNameAlreadyExists(name))
    throw new ApiError(httpStatus.CONFLICT, "Brand's name already exists");
};

const getBrands = () => {
  return Brand.findAll();
};

const getBrandsByCategoryCode = async (categoryCode) => {
  const category = await Category.findOneByCode(categoryCode, {
    include: Brand,
  });
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category code not exists');

  return category.brands;
};

const getBrandsByCategoryGroupCode = async (categoryGroupCode) => {
  const categories = await categoryService.getCategoriesByCategoryGroupCode(
    categoryGroupCode
  );
  const [...brands] = await Promise.all(
    categories.map((category) => category.getBrands())
  );
  const data = {};
  brands.flat().forEach((brand) => {
    if (!data[brand.id]) {
      data[brand.id] = brand;
    }
  });

  return Object.values(data);
};

const createBrand = async ({ name }) => {
  await checkBrandNameExists(name);
  return Brand.create({ name });
};

const updateBrand = async (brandId, { name }) => {
  const brand = await findBrandById(brandId);
  if (brand.name === name) return;
  await checkBrandNameExists(name);
  brand.name = name;
  brand.save();
};

const deleteBrand = async (brandId) => {
  const brand = await findBrandById(brandId, { include: Product });
  if (brand?.products?.length > 0)
    throw new ApiError(
      httpStatus.CONFLICT,
      "Can't delete brand, because some product is belong to this brand"
    );
  return brand.destroy();
};

module.exports = {
  findBrandById,
  getBrands,
  getBrandsByCategoryCode,
  getBrandsByCategoryGroupCode,
  createBrand,
  updateBrand,
  deleteBrand,
};
