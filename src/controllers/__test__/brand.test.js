const brandController = require('../brand.controller');
const model = require('../../models');

describe('Test brand controller functionality', () => {
  let req,
    res,
    next = null;

  beforeAll(() => {
    return model.initialize();
  });

  afterAll(() => {
    model.terminate;
  });

  beforeEach(() => {
    req = {};
    res = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Create new brand', () => {
    it("Should create new brand ", async () => {
      req.body.name = 'Puma __test__';
      brandController.addBrand(req, res, next);
    })

  });
});
