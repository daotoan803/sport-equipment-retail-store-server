const User = require('../../models/user.model');

module.exports = {
  async signup(req, res, next) {
    const { name, email, dob, gender, password } = req.body;
    try {
      const user = await User.signupUser({
        name,
        email,
        dob,
        gender,
        password,
      });
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  },
};
