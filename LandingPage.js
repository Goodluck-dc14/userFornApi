const express = require("express");
const router = express.Router();
const private = require("./PrivateRoute");

router.get("/", private, (req, res) => {
  res.status(200).json("welcome home");
});

module.exports = router;

