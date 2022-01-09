const path = require('path');

const uploadedImageDirPath = path.join(
  __dirname,
  '..',
  '..',
  'upload',
  'images'
);

module.exports = {
  uploadedImageDirPath,
};
