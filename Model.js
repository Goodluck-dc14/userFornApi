const mongoose = require("mongoose");
const login = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetLink: {
    type: String,
  },
});

module.exports = mongoose.model("login", login);
