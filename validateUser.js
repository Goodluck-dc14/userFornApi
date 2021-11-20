const joi = require("@hapi/joi");

const signup = (data) => {
  const getUsers = joi.object({
    username: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().required().min(4),
  });

  return getUsers.validate(data);
};

module.exports.signup = signup;

const Login = (data) => {
  const getUsers = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().min(4),
  });

  return getUsers.validate(data);
};

module.exports.Login = Login;
