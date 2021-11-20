const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access denied");

  try {
    const userToken = jwt.verify(token, process.env.TOKEN_SECRET);

    res.validUser = userToken;
    next();
  } catch (error) {
    res.status(404).json(error.message);
  }
};
