const app = require('../../../app');
const supertest = require('supertest')(app);
const User = require('../../models/user.model');

//this array contains all user that should be valid and save in database, so it can be clean up after test

describe('Test user functionality', () => {
  const validUsers = [
    {
      name: 'john',
      email: 'john2@example.com',
      dob: '10-12-2000',
      gender: 'male',
      password: 'password',
    },
  ];

  afterAll(async () => {
    await User.destroy({
      where: {
        email: validUsers.map((user) => user.email),
      },
    });
  });

  describe('User signup', () => {
    it('POST /api/user/signup --> New user should be signup successful', async () => {
      const res = await supertest.post('/api/user/signup').send(validUsers[0]);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
        })
      );
    });

    it('POST /api/user/signup --> Email should be already exists', async () => {
      const res = await supertest.post('/api/user/signup').send({
        name: 'John',
        email: validUsers[0].email,
        dob: '12-12-2000',
        gender: 'male',
        password: '1234ok',
      });
      expect(res.status).toBe(409);
    });

    it('POST /api/user/signup --> All request body should be invalid', async () => {
      const invalidUser = {
        name: '     ',
        email: 'test@@example.com',
        dob: '15-25-2000',
        gender: 'asmale',
        password: '12',
      };

      const res = await supertest.post('/api/user/signup').send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.arrayContaining(
          Object.keys(invalidUser).map((key) => ({
            field: expect.stringMatching(key),
            message: expect.any(String),
            received: expect.any(String),
          }))
        )
      );
    });
  });

  describe('User signin', () => {
    it('POST /api/user/signin --> Signin should be successful', async () => {
      const user = {
        email: validUsers[0].email,
        password: validUsers[0].password,
      };

      const res = await supertest.post('/api/user/signin').send(user);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
        })
      );
    });

    it('POST /api/user/signin --> Signin should be fail because wrong password', async () => {
      const user = {
        email: validUsers[0].email,
        password: 'falsdk;fjalsd',
      };

      const res = await supertest.post('/api/user/signin').send(user);

      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });
});
