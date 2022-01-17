const request = require('supertest');
const app = require('../../../app');
const User = require('../../models/user.model');
const database = require('../../models');
const res = require('express/lib/response');

//this array contains all user that should be valid and save in database, so it can be clean up after test
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

  await database.terminate();
});

describe('User signup', () => {
  it('POST /api/user/signup --> New user should be signup successful', function (done) {
    request(app)
      .post('/api/user/signup')
      .send(validUsers[0])
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            token: expect.any(String),
          })
        );
        done();
      })
      .catch(done);
  });

  it('POST /api/user/signup --> Email should be already exists', function (done) {
    request(app)
      .post('/api/user/signup')
      .send({
        name: 'John',
        email: validUsers[0].email,
        dob: '12-12-2000',
        gender: 'male',
        password: '1234ok',
      })
      .expect('Content-Type', /json/)
      .expect(409, done);
  });

  it('POST /api/user/signup --> All request body should be invalid', function (done) {
    const user = {
      name: '     ',
      email: 'test@@example.com',
      dob: '15-25-2000',
      gender: 'asmale',
      password: '12',
    };

    request(app)
      .post('/api/user/signup')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining(
            Object.keys(user).map((key) => ({
              field: expect.stringMatching(key),
              message: expect.any(String),
              received: expect.any(String),
            }))
          )
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('User signin', () => {
  it('POST /api/user/signin --> Signin should be successful', (done) => {
    const user = {
      email: validUsers[0].email,
      password: validUsers[0].password,
    };

    request(app)
      .post('/api/user/signin')
      .send(user)
      .expect('content-type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            token: expect.any(String),
          })
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('POST /api/user/signin --> Signin should be fail', (done) => {
    const user = {
      email: validUsers[0].email,
      password: 'falsdk;fjalsd',
    };

    request(app)
      .post('/api/user/signin')
      .send(user)
      .expect('content-type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.any(String),
          })
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
