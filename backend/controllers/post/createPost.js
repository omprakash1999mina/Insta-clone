const Joi = require("joi");
const user = require("../../models/user");
const post = require("../../models/post");
const { v4: uuidv4 } = require("uuid");

const createPost = async (req, res, next) => {
  const postSchema = Joi.object({
    postFileUrl: Joi.string().required(),
    postLikesCount: Joi.number().required(),
    postLikeUserIds: Joi.array().required(),
    postType: Joi.string().required(),
    // postContent:Joi.string(),
    // mentions : Joi.array(),
  });

  const { error } = postSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const userId = req.pathType == 1 ? req.userId : req.user.id;

  try {
    const userExist = await user.exists({ _id: userId });
    if (!userExist) {
      return res.status(400).json({ error: "User not found" });
    }

    // const mentionUsers = [];

    const { postFileUrl, postLikesCount, postLikeUserIds, postType } = req.body;
    const postUserId = req.pathType == 1 ? req.userId : req.user.id;
    post
      .create({ postUserId, postFileUrl, postLikesCount, postLikeUserIds, postType, slug: uuidv4() })
      .then(() => {
        return res.status(201).json({ message: "Post created successfully" });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = createPost;
