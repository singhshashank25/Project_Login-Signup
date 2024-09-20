const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User Created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User Not Found!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed!",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },
        "a_secret_key_should_be_longer_then_this",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Token Generation Failed",
      });
    });
});

module.exports = router;
