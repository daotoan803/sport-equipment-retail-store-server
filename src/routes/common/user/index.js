const routes = require('express').Router();
const validate = require('../../../middlewares/validate');
const userValidation = require('../../../validations/user.validation');
const userController = require('../../../controllers/user.controller');
const authMiddleware = require('../../../middlewares/authentication');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const chatRoutes = require('./chat.routes');

/*------------------------------------------------------*/
/*--------------------/api/user-----------------------*/
/*------------------------------------------------------*/

routes.post('/signup', validate(userValidation.signup), userController.signup);

routes.post('/signin', validate(userValidation.login), userController.login);

routes.post(
  '/logout-all',
  authMiddleware.verifyToken,
  userController.logoutAll
);

routes.post(
  '/check-token',
  authMiddleware.verifyToken,
  userController.checkToken
);

routes.get('/', authMiddleware.verifyToken, userController.getUserDetail);
routes.use('/cart', authMiddleware.verifyToken, cartRoutes);
routes.use('/order', authMiddleware.verifyToken, orderRoutes);
routes.use('/chat', authMiddleware.verifyToken, chatRoutes);

module.exports = routes;

/**
 * @openapi
 * tags:
 *  name: User
 *  description: User functionality
 */

/**
 *
 * @openapi
 * /api/user/signup:
 *  post:
 *    summary: Register new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - dob
 *              - gender
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *                minlength: 1
 *                maxLength: 254
 *              dob:
 *                type: string
 *                format: date
 *              gender:
 *                type: string
 *                enum: [male, female, other]
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 254
 *                description: must be unique
 *              password:
 *                type: string
 *                format: password
 *                minLength: 4
 *                maxLength: 200
 *    responses:
 *      "200":
 *        description: Signup success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  $ref: '#/components/schemas/token'
 *      "409":
 *        $ref: '#components/responses/DuplicateEmail'
 *
 *      "400":
 *        description: Invalid parameters
 */

/**
 * @openapi
 * /api/user/signin:
 *  post:
 *    summary: Signin with user account
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 254
 *              password:
 *                type: string
 *                format: password
 *                minLength: 4
 *                maxLength: 200
 *    responses:
 *      "200":
 *        description: Signin success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  $ref: '#/components/schemas/token'
 *                role:
 *                  type: string
 *                  enum: [admin, customer]
 *      "404":
 *        description: Email not exists
 *
 *      "400":
 *        description: Wrong password
 */

/**
 * @openapi
 * /api/user/logout-all:
 *  post:
 *    summary: Terminate all user token
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: header authorization
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: authorization token
 *    responses:
 *      "200":
 *        description: Success
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /api/user/check-token:
 *  post:
 *    summary: Check token is still valid
 *    tags: [User]
 *    parameters:
 *      - in: header authorization
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: authorization token
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      "204":
 *        description: Token still good
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /api/user/:
 *  get:
 *    summary: Get user detail
 *    tags: [User]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: header authorization
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: authorization token
 *    responses:
 *      "200":
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 */
