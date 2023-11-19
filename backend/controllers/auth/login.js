const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../../models/user");
const jwtServices = require("../../services/JwtServices");
const refreshSecreat = process.env.REFRESH_SECRET;
const RedisServices = require("../../services/RedisServices");

const login = async (req, res, next) => {
  const userSchema = Joi.object({
    email: Joi.string().required(), //This email can be username or phonenumber also
    password: Joi.string().required(),
  });

  const { error } = userSchema.validate(req.body);

  if (error) {
    next(error);
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    // Incase email  field is filled with username
    if (user == null) {
      user = await User.findOne({ userName: req.body.email });
    }

    if (user) {
      // console.log(user);
      await bcrypt
        .compare(req.body.password, user.password)
        .then((isCorrect) => {
          // console.log(isCorrect);
          if (isCorrect) {
            const id = user._id;
            const access_token = jwtServices.sign({ id: id });
            const refresh_token = jwtServices.sign({ id: id }, "7d", refreshSecreat);

            const ttl = 60 * 60 * 24 * 7;
            RedisServices.createClient()
              .set(id, refresh_token, "ex", ttl)
              .then((ok) => {
                if (!ok) {
                  return res.status(500).json({ error: "Internal Server Error" });
                }
              })
              .catch((error) => {
                console.log(error);
                return res.status(500).json({ error: "Internal Server Error" });
              });
            return res.status(200).json({ id, access_token, refresh_token });
          } else {
            return res.status(404).json({ error: "Invalid credentials" });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(404).json({ error: "Invalid credentials" });
        });
    } else {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    // .catch((err) => {
    //   console.log(err);
    //   return res.status(404).json({ error: "Invalid credentials1" });
    // });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = login;
