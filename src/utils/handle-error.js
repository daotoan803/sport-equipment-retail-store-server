/**
 * Generate error wrapper for controller
 * @param  {function} function
 * @return {function}
 */
const handleError = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

module.exports = handleError;
