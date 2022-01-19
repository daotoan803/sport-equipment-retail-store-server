const request = require('supertest');

const adminAccount = {
  email: 'vnsport@vnsport.com',
  password: 'admin',
};

module.exports = {
  async getAdminToken(app) {
    const response = await request(app)
      .post('/api/user/signin')
      .send(adminAccount);

    return response.body.token;
  },
};
