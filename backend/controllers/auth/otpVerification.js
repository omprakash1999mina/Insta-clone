const Joi = require("joi");
const RedisServices = require("../../services/RedisServices");
const User = require("../../models/user");
const axios = require("axios");
const otpVerify = (req, res, next) => {
  const otpSchema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.number().required(),
  });

  const { error } = otpSchema.validate(req.body);
  if (error) return next(error);

  const { email, otp } = req.body;
  console.log(email, otp);

  try {
    // console.log("first");
    RedisServices.createClient()
      .get(email)
      .then((resp) => {
        // console.log("first1");
        console.log(resp);
        if (resp == null) {
          // console.log("first10");
          return res.status(500).json({ error: "Invalid OTP" });
        } else {
          
          if (resp == otp) {
            User.findOneAndUpdate({ email: email }, { isVerified: true })
              .then((response) => {
                const config = {
                  headers: {
                    "Content-Type": "application/json",
                  },
                };
                const data = {
                  email: email,
                  subject: "Your account has been verified",
                  username: response.userName,
                  company: "Tech Developers",
                };
                axios
                  .post(process.env.EMAIL_API_URL + "api/success", data, config)
                  .then((res) => {})
                  .catch((err) => {
                    console.log("error in sending mail to :" + email);
                  });
                return res.status(200).json({ message: "OTP verified" });
              })
              .catch((err) => {
                return res.status(500).json({ error: "Internal Server Error" });
              });
          } else {
            return res.status(500).json({ error: "Invalid otp" });
          }
        }
      })
      .catch((err) => {
        console.log("redis error: " + err);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = otpVerify;
