exports.fileUploadingIsImage = (file) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const extname = imageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = imageTypes.test(file.mimetype);
  if (mimetype && extname) return true;
  return false;
};
