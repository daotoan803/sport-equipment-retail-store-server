const path = require('path');
const { uploadedImageDirPath } = require('./project-path');
const fs = require('fs');

module.exports = {
  fileUploadingIsImage(file) {
    const validImageExtname = ['.jpeg', '.jpg', '.png', '.gif'];
    const extnameIsValid = validImageExtname.includes(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeTypeIsValid = file.mimetype.split('/')[0] === 'image';
    if (extnameIsValid && mimeTypeIsValid) return true;
    return false;
  },

  createImageUrlFromMulterFile(image) {
    return '/images/' + image.filename;
  },

  deleteUploadedImageByUrl(imageUrl = '') {
    const imageName = imageUrl.split('/images/')[1];
    return fs.promises.unlink(uploadedImageDirPath, imageName);
  },
};
