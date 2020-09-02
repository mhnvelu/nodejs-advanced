const { clear } = require("../services/cache");

module.exports = async (req, res, next) => {
  await next();
  clear(req.user.id);
};
