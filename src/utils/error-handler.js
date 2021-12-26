exports.parseValidationErrors = (err) => {
  const errors = {};
  err.errors.forEach((e) => (errors[e.path] = e.message));
  return errors;
};
