const joi = require("joi");
const User = require("../../models/user");

const userCheck = {
  async emailExist(req, res, next) {
    const schema = joi.object({
      email: joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        return res.status(200).json({ message: true });
      }
      return res.status(200).json({ message: false });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async userNameExist(req, res, next) {
    const schema = joi.object({
      username: joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const userExist = await User.findOne({ userName: req.body.username });
      if (userExist) {
        return res.status(200).json({ message: true });
      }
      return res.status(200).json({ message: false });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = userCheck;
