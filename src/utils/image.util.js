const path = require('path');

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

  createImageUrl(imageFilename) {
    return '/images/' + imageFilename;
  },
};
