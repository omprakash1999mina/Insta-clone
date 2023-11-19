const jwtService = require("../../services/JwtServices");
const joi = require("joi");
const user = require("../../models/user");
const RedisServices = require("../../services/RedisServices");

const refresh = async (req, res, next) => {
  const schema = joi.object({
    refresh_token: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    next(error);
  }

  try {
    let userId;
    try {
      console.log(req.body);
      const val = jwtService.verify(req.body.refresh_token,process.env.REFRESH_SECRET);
      const { id } = val;
      userId = id;
      RedisServices.createClient()
        .get(userId)
        .then((res) => {
          if (res == null) {
            return res.status(500).json({ error: "Invalid refresh token" });
          }
        })
        .catch((err) => {
          console.log("redis error: " + err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    } catch (err) {
      console.log("redis error: " + err);

      return res.status(500).json({ error: "Internal Server Error" });
    }

    const access_token = jwtService.sign({id:user.id});
    return res.status(200).json({access_token:access_token,refresh_token:req.body.refresh_token});

  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = refresh
