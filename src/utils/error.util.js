const fs = require('fs');

const parseValidationErrors = (err) => {
  const errors = {};
  err.errors.forEach((e) => (errors[e.path] = e.message));
  return errors;
};

const deleteUploadedFiles = (...files) => {
  try {
    files.forEach((file) => {
      fs.promises.unlink(file.destination);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  parseValidationErrors,
  deleteUploadedFiles,
};
