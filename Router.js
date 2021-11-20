const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const login = require("./Model");
const bcrypt = require("bcrypt");
const { signup, Login } = require("./validateUser");
const jwt = require("jsonwebtoken");

const api_key = "20a72a4487fd35eeaf0604d4777daa09-2bf328a5-1c3e30d9";
const domain = "sandboxd94a0a24f1b24be6b6121a290beecd9d.mailgun.org";
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

router.get("/", async (req, res) => {
  const getUsers = await login.find();
  res.status(200).json(getUsers);
});

router.post("/signup", async (req, res) => {
  const { error } = await signup(req.body);

  if (error) {
    return res.status(401).json(error.details[0].message);
  }
  hider = await bcrypt.genSalt(10);
  passwordHider = await bcrypt.hash(req.body.password, hider);

  const emailChecker = await login.findOne({ email: req.body.email });
  if (emailChecker) {
    res.status(401).send("Email already used");
  }
  const getUsers = await login.create({
    username: req.body.username,
    email: req.body.email,
    password: passwordHider,
  });
  res.status(201).json(getUsers);
});

router.post("/Login", async (req, res) => {
  const { error } = await Login(req.body);

  if (error) {
    return res.status(401).json(error.details[0].message);
  }

  const emailChecker = await login.findOne({ email: req.body.email });
  if (!emailChecker) {
    res.status(401).send("Invalid Email");
  }

  const passwordChecker = await bcrypt.compare(
    req.body.password,
    emailChecker.password
  );
  if (!passwordChecker) {
    return res.status(401).send("Incorrect password");
  }
  const token = jwt.sign({ _id: Login._id }, process.env.TOKEN_SECRET);

  res.header("auth-token").send(token);
});

router.put("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  login.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json("user with this email is not found");
    }
    const token = jwt.sign({ _id: login._id }, process.env.TOKEN_SECRET, {
      expiresIn: "20m",
    });

    var data = {
      from: "Excited User <me@samples.mailgun.org>",
      to: email,
      subject: "password reset link",
      text: "<h2> Click on the link to reset your password</h2> <p> ${process.env.CLIENT_URL}/forgotPassword/${token}</p>",
    };

    login.updateOne(
      { resetLink: token },
      process.env.TOKEN_SECRET,
      (err, success) => {
        if (err) {
          return res.status(401).json("invalid token");
        }
        mailgun.messages().send(data, function (error, body) {
          if (error) {
            return res.status(401).json(error);
          } else {
            return res.status(200).json("check you mail to reset your passwrd");
          }
        });
      }
    );
  });
});

module.exports = router;
