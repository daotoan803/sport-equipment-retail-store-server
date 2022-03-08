const httpStatus = require('http-status');
const categoryService = require('../services/category.service');
const handleError = require('../utils/handle-error');

const getCategories = handleError(async (req, res) => {
  const { brandId, categoryGroupCode } = req.query;

  let categories = null;
  if (brandId) {
    categories = await categoryService.getCategoriesByBrandId(brandId);
  } else if (categoryGroupCode) {
    categories = await categoryService.getCategoriesByCategoryGroupCode(
      categoryGroupCode
    );
  } else {
    categories = await categoryService.getCategories();
  }
  res.json(categories);
});

const getCategoryGroups = handleError(async (req, res) => {
  res.json(await categoryService.getCategoryGroups());
});

const addCategory = handleError(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  return res.json({ category });
});

const updateCategory = handleError(async (req, res) => {
  await categoryService.updateCategory(req.params.categoryId, req.body);
  return res.sendStatus(httpStatus.NO_CONTENT);
});

const deleteCategory = handleError(async (req, res) => {
  await categoryService.deleteCategory(req.params.categoryId);
  return res.sendStatus(httpStatus.NO_CONTENT);
});

const addCategoryGroup = handleError(async (req, res) => {
  const categoryGroup = await categoryService.createCategoryGroup(req.body);
  return res.json({ categoryGroup });
});

const updateCategoryGroup = handleError(async (req, res) => {
  await categoryService.updateCategoryGroup(
    req.params.categoryGroupId,
    req.body
  );
  return res.sendStatus(httpStatus.NO_CONTENT);
});

const deleteCategoryGroup = handleError(async (req, res) => {
  await categoryService.deleteCategoryGroup(req.params.categoryGroupId);

  res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  getCategories,
  getCategoryGroups,
  addCategory,
  updateCategory,
  deleteCategory,
  addCategoryGroup,
  updateCategoryGroup,
  deleteCategoryGroup,
};
