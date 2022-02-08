const fs = require('fs');
const path = require('path');
const projectPath = require('./project-path');
const User = require('../models/user.model');
const authController = require('../controllers/common/auth.controller');

const adminAccount = {
  email: 'vnsport@vnsport.com',
  password: 'admin',
};

module.exports = {
  async getAdminToken() {
    const admin = await User.validateLoginAndGetUser(
      adminAccount.email,
      adminAccount.password
    );

    const req = {
      user: admin,
    };
    const res = {
      json: jest.fn(),
    };

    authController.createAccessToken(req, res);
    const adminToken = res.json.mock.calls[0][0].token;
    return adminToken;
  },

  deleteUploadedTestImageByImageUrl(...imageUrls) {
    const async = [];
    for (let image of imageUrls) {
      const imageName = image.split('/images/')[1];
      async.push(
        fs.promises.unlink(
          path.join(projectPath.uploadedImageDirPath, imageName)
        )
      );
    }
    return Promise.all(async);
  },
};
