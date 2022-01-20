const fs = require('fs');
const path = require('path');
const projectPath = require('./project-path');
const axios = require('axios');

const adminAccount = {
  email: 'vnsport@vnsport.com',
  password: 'admin',
};

module.exports = {
  async getAdminToken(proxy) {
    const response = await axios.post(`${proxy}/api/user/signin`, adminAccount);

    return response.data.token;
  },

  async deleteUploadedTestImage(...images) {
    for (let image of images) {
      const imageName = image.split('/images/')[1];

      fs.unlink(
        path.join(projectPath.uploadedImageDirPath, imageName),
        (err) => {
          if (err) throw err;
        }
      );
    }
  },
};
