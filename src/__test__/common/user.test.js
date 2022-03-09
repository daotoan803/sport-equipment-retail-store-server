const app = require('../../../app');
const supertest = require('supertest');
const { faker } = require('@faker-js/faker');
const User = require('../../models/user.model');

describe('Test crud user functionality', () => {
  const newAccount = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    gender: 'male',
    dob: Date.now(),
    name: faker.name.firstName(),
  };

  let signupToken = null;
  let loginToken = null;

  afterAll(async () => {
    const createdUser = await User.findOne({
      where: { email: newAccount.email },
    });
    return createdUser.destroy();
  });

  describe('POST: /api/user/signup Signup functionality', () => {
    it('Should signup success', async () => {
      const res = await supertest(app)
        .post('/api/user/signup')
        .send(newAccount);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.user).toEqual(expect.any(Object));
      expect(res.body.user.id).toEqual(expect.anything());
      expect(res.body.user.name).toEqual(expect.any(String));
      expect(res.body.token).toEqual(expect.any(String));

      signupToken = res.body.token;
    });

    it('Should signup fail because email conflict', async () => {
      const res = await supertest(app)
        .post('/api/user/signup')
        .send(newAccount);

      expect(res.status).toBe(409);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should signup fail because invalid email', async () => {
      const res = await supertest(app).post('/api/user/signup').send({
        email: '1234',
        password: '5678',
        gender: 'male',
        dob: Date.now(),
        name: faker.name.firstName(),
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should signup fail because missing field', async () => {
      const res = await supertest(app).post('/api/user/signup').send({
        password: '5678',
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should signup fail because invalid field', async () => {
      const res = await supertest(app).post('/api/user/signup').send({
        email: '123@tests.com',
        password: '1',
        gender: 'male',
        dob: Date.now(),
        name: faker.name.firstName(),
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.error).toEqual(expect.any(String));
    });
  });

  describe('POST: /api/user/signin Signin functionality', () => {
    it('Should signin with admin role', async () => {
      const adminAccount = {
        email: 'vnsport@vnsport.com',
        password: 'admin',
      };
      const res = await supertest(app)
        .post('/api/user/signin')
        .send(adminAccount);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.user).toEqual(expect.any(Object));
      expect(res.body.user.id).toEqual(expect.anything());
      expect(res.body.user.name).toEqual(expect.any(String));
      expect(res.body.role).toEqual('admin');
      expect(res.body.token).toEqual(expect.any(String));
    });

    it('Should login with user success', async () => {
      const res = await supertest(app).post('/api/user/signin').send({
        email: newAccount.email,
        password: newAccount.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.user).toEqual(expect.any(Object));
      expect(res.body.user.id).toEqual(expect.anything());
      expect(res.body.user.name).toEqual(expect.any(String));
      expect(res.body.role).toBe('customer');
      expect(res.body.token).toEqual(expect.any(String));

      loginToken = res.body.token;
    });

    it('Should login fail because wrong password', async () => {
      const res = await supertest(app)
        .post('/api/user/signin')
        .send({
          email: newAccount.email,
          password: newAccount.password + 123,
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.error).toEqual(expect.any(String));
    });

    it('Should login fail because wrong email', async () => {
      const res = await supertest(app).post('/api/user/signin').send({
        email: 'user4@gmai.com',
        password: newAccount.password,
      });

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expect.any(Object));
      expect(res.body.error).toEqual(expect.any(String));
    });
  });

  describe('Check Token', () => {
    it('Token received from signup success should be valid', async () => {
      const res = await supertest(app)
        .post('/api/user/check-token')
        .set('authorization', 'Bearer ' + signupToken);

      expect(res.status).toBe(204);
    });

    it('Token received from login success should be valid', async () => {
      const res = await supertest(app)
        .post('/api/user/check-token')
        .set('authorization', 'Bearer ' + loginToken);

      expect(res.status).toBe(204);
    });

    it('Token should be invalid', async () => {
      const res = await supertest(app)
        .post('/api/user/check-token')
        .set('authorization', 'Bearer ' + loginToken + '123');

      expect(res.status).toBe(401);
    });

    it('Should fail because missing token', async () => {
      const res = await supertest(app).post('/api/user/check-token');

      expect(res.status).toBe(403);
    });

    it('Should make every token belong to user invalid', async () => {
      await supertest(app)
        .post('/api/user/logout-all')
        .set('authorization', 'Bearer ' + loginToken)
        .expect(200);
      const [resSignup, resSignin] = await Promise.all([
        supertest(app)
          .post('/api/user/check-token')
          .set('authorization', 'Bearer ', signupToken),
        supertest(app)
          .post('/api/user/check-token')
          .set('authorization', 'Bearer ', signupToken),
      ]);
      expect(resSignup.status).toBe(401);
      expect(resSignin.status).toBe(401);
    });
  });
});
