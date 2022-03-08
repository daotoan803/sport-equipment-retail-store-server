const httpStatus = require('http-status');
const brandService = require('../services/brand.service');
const handleError = require('../utils/handle-error');

const getBrands = handleError(async (req, res) => {
  const { categoryGroupCode, categoryCode } = req.query;
  let brands = null;
  if (categoryCode) {
    brands = await brandService.getBrandsByCategoryCode(categoryCode);
  } else if (categoryGroupCode) {
    brands = await brandService.getBrandsByCategoryGroupCode(categoryGroupCode);
  } else {
    brands = await brandService.getBrands();
  }

  res.json(brands);
});

const addBrand = handleError(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.json({ brand });
});

const updateBrand = handleError(async (req, res) => {
  await brandService.updateBrand(req.params.brandId, req.body);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const deleteBrand = handleError(async (req, res) => {
  await brandService.deleteBrand(req.params.brandId);
  res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
};
