const jwtService = require("../../services/JwtServices");
const joi = require("joi");
const RedisServices = require("../../services/RedisServices");

const logout = async (req, res, next) => {
  // console.log("first1")
  if (req.pathType == 1) {
    console.log("first")
    const schema = joi.object({
      refresh_token: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }

    try {
      const { id } = jwtService.verify(req.body.refresh_token, process.env.REFRESH_SECRET);
      RedisServices.createClient()
        .del(id)
        .then((ok) => {
          console.log(ok);
          if (ok) {
            return res.status(200).json({ message: "Logout successfully." });
          }
        })
        .catch((err) => {
          return res.status(500).json({ err: "Internal Server Error" });
        });
    } catch (e) {
      return res.status(500).json({ err:"Internal Server Error"})
    }
  }else{
    // Case of OAuth Login
    // console.log("logoutt")
    req.logout()
    return res.status(200).json({ message: "Logout successfully." });
  }
};

module.exports = logout;
