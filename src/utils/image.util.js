const path = require('path');

exports.fileUploadingIsImage = (file) => {
  const validImageExtname = ['.jpeg', '.jpg', '.png', '.gif'];
  const extnameIsValid = validImageExtname.includes(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeTypeIsValid = file.mimetype.split('/')[0] === 'image';
  if (extnameIsValid && mimeTypeIsValid) return true;
  return false;
};
