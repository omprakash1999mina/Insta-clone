const Joi = require("joi");
const User = require("../../models/user");
const axios = require("axios");
const RedisService = require("../../services/RedisServices");
const RedisServices = require("../../services/RedisServices");
const bcrypt = require("bcrypt");

const Forgot = {
  async ForgotPassword(req, res, next) {
    const forgotSchema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = forgotSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const { email } = req.body;
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        const otp = generateOtpCode();
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        // sending mail to user
        let success;
        const data = {
          email: email,
          subject: "Password Reset",
          username: userExist.userName,
          otp: otp,
          company: "Tech Developers",
        };
        await axios
          .post(process.env.EMAIL_API_URL + "api/password-reset", data, config)
          .then((res) => {
            success = true;
          })
          .catch((err) => {
            success = false;
            console.log(err);
            console.log("error in sending mail to :" + email);
          });
        if (success) {
          // set the otp in redis
          const ttl = 60 * 10; // for 10 mins
          const ok = RedisService.createClient().set(email, otp, "EX", ttl);
          if (!ok) {
            // discord.SendErrorMessageToDiscord(email, "OTP SEND", "error in setup the otp in redis !!");
            return res.status(500).json({ error: "Internal Server Error1" });
          }
        } else {
          // discord.SendErrorMessageToDiscord(email, "OTP SEND", "error in setup the otp in redis !!");
          return res.status(500).json({ error: "Internal Server Error2" });
        }
        return res.status(200).json({ message: "OTP sent successfully" });
      } else {
        return res.status(404).json({ error: "User does not exist" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error3" });
    }
  },

  async ResetPassword(req, res, next) {
    const resetSchema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.number().required(),
      password: Joi.string().required(),
    });

    const { error } = resetSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { email, password, otp } = req.body;
    try {
      RedisServices.createClient()
        .get(email)
        .then(async (response) => {
          if (response === otp) {
            const hashedPassword = await bcrypt.hash(password, 12);
            User.findOneAndUpdate({ email: email }, { password: hashedPassword })
              .then((result) => {
                return res.status(200).json({ message: "Password reset successfully" });
              })
              .catch((error) => {
                console.log(error);
                return res.status(500).json({ error: "Internal Server Error" });
              });
          } else {
            return res.status(404).json({ error: "Invalid OTP!" });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async ChangePassword(req, res, next) {
    const changePasswordSchema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    });

    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // console.log(req.body)
    const { oldPassword, newPassword } = req.body;
    console.log(req.userId.id, oldPassword, newPassword);
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      User.findById(req.userId.id)
        .then(async (user) => {
          if (user != null) {
            const isCorrect = await bcrypt.compare(oldPassword, user.password);
            if (isCorrect) {
              User.findByIdAndUpdate(req.userId.id, { password: hashedNewPassword })
                .then(() => {
                  return res.status(200).json({ message: "Password changed successfully" });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({ error: "Internal Server Error" });
                });
            } else {
              return res.status(404).json({ error: "Invalid old password!" });
            }
          } else {
            return res.status(500).json({ error: "Internal Server Error" });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

const generateOtpCode = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber;
};

module.exports = Forgot;
