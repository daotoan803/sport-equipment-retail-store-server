const Category = require('../models/category.model');
const Product = require('../models/product.model');
const CategoryGroup = require('../models/category-group.model');
const Brand = require('../models/brand.model');
const ApiError = require('../errors/ApiError');
const httpStatus = require('http-status');
const CategoryBrand = require('../models/category-brand.model');

const findCategoryById = async (categoryId, option = {}) => {
  const category = await Category.findByPk(categoryId, option);
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category id not exists');
  return category;
};

const findCategoryGroupById = async (categoryGroupId, option = {}) => {
  const categoryGroup = await CategoryGroup.findByPk(categoryGroupId, option);
  if (!categoryGroup)
    throw new ApiError(httpStatus.NOT_FOUND, 'Category group id not exists');
  return categoryGroup;
};

const checkCategoryNameExists = async (name) => {
  if (await Category.isNameAlreadyExists(name)) {
    throw new ApiError(httpStatus.CONFLICT, 'Category name already taken');
  }
};

const checkCategoryGroupNameExists = async (name) => {
  if (await CategoryGroup.isNameAlreadyExists(name)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Category group name already taken'
    );
  }
};

const getCategories = () => {
  return Category.findAll();
};

const getCategoriesByCategoryGroupCode = async (categoryGroupCode) => {
  const categoryGroup = await CategoryGroup.findOne({
    where: { code: categoryGroupCode },
    include: Category,
  });
  if (!categoryGroup)
    throw new ApiError(httpStatus.NOT_FOUND, 'category group code not found');
  return categoryGroup.categories;
};

const getCategoriesByBrandIdAndCategoryGroupCode = async (
  brandId,
  categoryGroupCode = null
) => {
  let categoryGroupId = null;
  if (categoryGroupCode) {
    const categoryGroup = await CategoryGroup.findOne({
      where: { code: categoryGroupCode },
    });
    if (!categoryGroup)
      throw new ApiError(httpStatus.NOT_FOUND, "Category group's id not found");
    categoryGroupId = categoryGroup.id;
  }
  const option = categoryGroupCode
    ? { include: { model: Category, where: { categoryGroupId } } }
    : { include: Category };

  const brand = await Brand.findByPk(brandId, option);
  if (!brand) throw new ApiError(httpStatus.NOT_FOUND, 'Brand id not exists');
  return brand.categories;
};

const getCategoryGroups = () => CategoryGroup.findAll({ include: Category });

const addBrandToCategory = async (categoryId, brandId) => {
  try {
    await CategoryBrand.create({ categoryId, brandId });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      await CategoryBrand.increment('productsCount', {
        by: 1,
        where: { categoryId, brandId },
      });
    } else {
      throw e;
    }
  }
};

const createCategory = async ({ name, categoryGroupId }) => {
  const categoryGroup = await CategoryGroup.findByPk(categoryGroupId);
  if (!categoryGroup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category group id not exists');
  }

  await checkCategoryNameExists(name);
  return categoryGroup.createCategory({ name });
};

const updateCategory = async (categoryId, { name, categoryGroupId }) => {
  categoryGroupId = Number(categoryGroupId);
  const category = await findCategoryById(categoryId);
  if (category.name === name && category.categoryGroupId == categoryGroupId)
    return;

  if (category.name !== name) {
    await checkCategoryNameExists(name);
    category.name = name;
  }

  if (category.categoryGroupId !== categoryGroupId) {
    await findCategoryGroupById(categoryGroupId);
    category.categoryGroupId = categoryGroupId;
  }

  return category.save();
};

const deleteCategory = async (categoryId) => {
  const category = await findCategoryById(categoryId, { include: Product });
  if (category.products?.length > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Can't delete category because some product is belong to this category, try to remove those products first"
    );
  }
  return category.destroy();
};

const createCategoryGroup = async ({ name }) => {
  await checkCategoryGroupNameExists(name);
  return CategoryGroup.create({ name });
};

const updateCategoryGroup = async (categoryGroupId, { name }) => {
  const categoryGroup = await findCategoryGroupById(categoryGroupId);
  if (categoryGroup.name === name) return;
  await checkCategoryGroupNameExists(name);
  categoryGroup.name = name;
  return categoryGroup.save();
};

const deleteCategoryGroup = async (categoryGroupId) => {
  const categoryGroup = await findCategoryGroupById(categoryGroupId, {
    include: Category,
  });
  if (categoryGroup.categories?.length > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Can't delete category group because some category is belong to this category group"
    );
  }
  return categoryGroup.destroy();
};

module.exports = {
  getCategories,
  getCategoriesByCategoryGroupCode,
  getCategoriesByBrandIdAndCategoryGroupCode,
  getCategoryGroups,
  findCategoryById,
  addBrandToCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createCategoryGroup,
  updateCategoryGroup,
  deleteCategoryGroup,
};
