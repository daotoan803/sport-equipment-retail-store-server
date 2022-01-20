const fs = require('fs');

const deleteImage = (path) => {
  if (!path) return;
  return fs.unlink(path, (err) => {
    if (err) console.log(path);
  });
};

module.exports = {
  deleteUploadedImages: (uploadedImages) => {
    if (uploadedImages instanceof Array) {
      return uploadedImages.forEach((image) => deleteImage(image.path));
    }

    return deleteImage(uploadedImages.path);
  },
};
