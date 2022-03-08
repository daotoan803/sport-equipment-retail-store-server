const multer = require('multer');
const path = require('path');
const imageUtils = require('../utils/image.util');
const projectPath = require('../utils/project-path');
const uuid = require('uuid');
const handleError = require('../utils/handle-error');
const httpStatus = require('http-status');

const invalidImageTypeError = 'invalid image type';

const imageFilter = (req, file, cb) => {
  if (!imageUtils.fileUploadingIsImage(file)) {
    req.fileError = '';
    return cb(new multer.MulterError(invalidImageTypeError), false);
  }
  cb(null, true);
};

const handleUploadError = (err, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Only accept 1 image' });
    }
    if (err.code === invalidImageTypeError) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Only accept images in jpeg|jpg|png|gif' });
    }
    console.error(err);
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  next(err);
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, projectPath.uploadedImageDirPath),
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}_${uuid.v4()}_${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const imageHandler = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
});

const handleImagesUpload = (fieldName) => {
  return handleError((req, res, next) => {
    const handler = imageHandler.array(fieldName);
    handler(req, res, (err) => handleUploadError(err, res, next));
  });
};

const handleImageUpload = (fieldName) => {
  return handleError((req, res, next) => {
    const handler = imageHandler.single(fieldName);
    handler(req, res, (err) => handleUploadError(err, res, next));
  });
};

const handleMixedImageUpload = (fields = []) => {
  return handleError((req, res, next) => {
    const handler = imageHandler.fields(fields);
    handler(req, res, (err) => handleUploadError(err, res, next));
  });
};

module.exports = {
  handleImageUpload,
  handleImagesUpload,
  handleMixedImageUpload,
};
