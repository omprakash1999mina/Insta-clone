const User = require("../../models/user");
const Post = require("../../models/post");
const Joi = require("joi");
const UserDetails = async (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return next(error);
  }

  try {
    const { userName } = req.query;
    const viewerId = req.pathType == 1 ? req.userId : req.user.id;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let follow_by_viewer = false;
    let follow_viewer = false;
    let user_is_Viewer = user._id == viewerId ? true : false;

    if (viewerId && viewerId != "" && viewerId != " ") {
      for (const id of user.followers) {
        console.log(id);
        if (id === viewerId) {
          follow_by_viewer = true;
        }
      }

      for (const id of user.following) {
        if (id === viewerId) {
          follow_viewer = true;
        }
      }
    }
    const posts = await Post.find({ postUserId: user._id });

    const response = {
      id: user._id,
      full_name: user.name,
      userName: userName,
      follow_by_viewer: follow_by_viewer,
      follow_viewer: follow_viewer,
      user_is_Viewer: user_is_Viewer,
      postCount: posts ? posts.length : 0,
      followers: user.followers,
      following: user.following,
      profileImageUrl: user.profileImageUrl,
    };

    return res.status(200).json({ user: response, status: "ok" });
  } catch (error) {
    return res.status(500).json({error:"Internal Server Error"});
  }
};

module.exports = UserDetails;
