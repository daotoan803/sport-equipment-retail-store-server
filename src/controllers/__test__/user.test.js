require('dotenv').config();
const database = require('../../models');
const userController = require('../user.controller');
const User = require('../../models/user.model');

// const app = require('../../../app');

describe('Signup function', () => {
  beforeAll(() => database.initialize());
  afterAll(async () => {
    const asyncTrack = [];
    testData.forEach((testCase) => {
      if (testCase[0].email) {
        email = testCase[0].email;
        asyncTrack.push(User.destroy({ where: { email } }));
      }
    });
    await Promise.all(asyncTrack);
    return database.terminate();
  });

  const testData = [
    // [user, expecting]
    [
      //Empty name field
      {
        name: '',
        email: 'john@example.com',
        dob: new Date('12-10-2000').toUTCString(),
        gender: 'male',
        password: 'password',
      },
      {
        status: 400,
        result: {
          name: expect.any(String),
        },
      },
    ],
    [
      //All good
      {
        name: 'john',
        email: 'john@example.com',
        dob: new Date('11-19-2008').toUTCString(),
        gender: 'male',
        password: 'password',
      },
      {
        status: 200,
        result: {
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          dob: expect.any(Date),
          gender: expect.any(String),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
      },
    ],
    [
      //Duplicated email
      {
        name: 'john',
        email: 'john@example.com',
        dob: new Date('11-19-2008').toUTCString(),
        gender: 'male',
        password: 'password',
      },
      {
        status: 409,
        result: {
          error: expect.any(String),
        },
      },
    ],
    [
      // Invalid gender
      {
        name: 'john',
        email: 'john123@example.com',
        dob: new Date('11-19-2008').toUTCString(),
        gender: 'males',
        password: 'password',
      },
      {
        status: 400,
        result: {
          gender: expect.any(String),
        },
      },
    ],
    [
      // Invalid dob
      {
        name: 'john',
        email: 'john123@example.com',
        dob: '15-12-2000',
        gender: 'male',
        password: 'password',
      },
      {
        status: 400,
        result: {
          dob: expect.any(String),
        },
      },
    ],
  ];

  test.each(testData)(
    'Signup\n user %o\n expecting %j',
    async (user, expecting) => {
      const req = {
        body: user,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      await userController.signup(req, res, next);
      expect(res.status.mock.calls[0][0]).toBe(expecting.status);
      expect(res.json).toBeCalledWith(expecting.result);
      return 'ok';
    }
  );
});
