const app = require('../../../app');
const supertest = require('supertest');

const getAdminToken = async () => {
  const adminAccount = {
    email: 'vnsport@vnsport.com',
    password: 'admin',
  };
  const res = await supertest(app).post('/api/user/signin').send(adminAccount);

  return res.body.token;
};

const getNormalUserToken = async () => {
  const user = {
    email: 'user1@test.com',
    password: 'test',
  };
  const res = await supertest(app).post('/api/user/signin').send(user);
  return res.body.token;
};

module.exports = {
  getAdminToken,
  getNormalUserToken,
};
