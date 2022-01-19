const formatValidationError = (errors) => {
  return errors.map((err) => ({
    field: err.context.key,
    message: err.message,
    received: err.context.value,
  }));
};

module.exports = {
  responseValidationError: (response, error) => {
    const errors = formatValidationError(error.details);
    return response.status(400).json(errors);
  },
};
