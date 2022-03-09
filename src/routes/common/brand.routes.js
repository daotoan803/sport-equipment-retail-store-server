const routes = require('express').Router();
const brandController = require('../../controllers/brand.controller');
const brandValidation = require('../../validations/brand.validation');
const validate = require('../../middlewares/validate');

routes.get('/', validate(brandValidation.getBrands), brandController.getBrands);

module.exports = routes;

/**
 * @openapi
 * /api/brands:
 *  get:
 *    tags: [Brand]
 *    summary: Get brands
 *    parameters:
 *      - in: query
 *        name: categoryCode
 *        description: Find brand by category code
 *      - in: query
 *        name: categoryGroupCode
 *        description: Find brand by category group code
 *    responses:
 *      200:
 *        description: Get list of brands success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                    $ref: '#components/schemas/Brand'
 *      404:
 *        description: categoryCode or categoryGroupCode not exists
 */
