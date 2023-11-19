const Joi = require("joi");
const User = require("../../models/user");

const isUser = async (req, res, next) => {
  try {
    const userId = req.pathType == 1 ? req.userId : req.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(user)
    const response = {
      id: user._id,
      full_name: user.name,
      userName: user.userName,
      profileImageUrl: user.profileImageUrl,
    };
    return res.status(200).json({ user: response, status: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = isUser;
