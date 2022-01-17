const multer = require('multer');
const path = require('path');
const imageUtils = require('../utils/image.util');
const projectPath = require('../utils/project-path');
const uuid = require('uuid');

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, projectPath.uploadedImageDirPath),
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}_${uuid.v4()}_${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const imageFilter = (req, file, cb) => {
  if (!imageUtils.fileUploadingIsImage(file)) {
    req.fileError = 'Only accept images in jpeg|jpg|png|gif ';
    return cb(null, false);
  }
  cb(null, true);
};

const imageHandler = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
});

const handleUploadError = (err, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Only accept 1 image' });
    }
    console.error(err);
    return res.status(400).json(err);
  }
  if (err) {
    return next(err);
  }

  next();
};

module.exports = {
  handleMultipleImagesUpload(req, res, next) {
    const multipleImagesUpload = imageHandler.array('images');
    multipleImagesUpload(req, res, (err) => handleUploadError(err, res, next));
  },

  handleSingleImageUpload(req, res, next) {
    const singleImageUpload = imageHandler.single('image');
    singleImageUpload(req, res, (err) => handleUploadError(err, res, next));
  },
};
