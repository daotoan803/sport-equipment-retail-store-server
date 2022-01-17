const validator = require('../validator');

describe('Validate user input', () => {
  it('Should be a valid user input', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@example.com',
        dob: '10-12-2000',
        gender: 'male',
        password: '12',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validator.validateUserSignup(req, res, next);
    expect(res.status.mock.calls[0][0]).toBe(400);
    expect(res.json).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          field: expect.stringContaining('password'),
          message: expect.any(String),
          value: expect.stringContaining(req.body.password),
        }),
      ])
    );
    expect(next).not.toHaveBeenCalled();
  });
});
