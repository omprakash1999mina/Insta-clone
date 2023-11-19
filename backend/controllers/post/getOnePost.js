const Joi = require("joi");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");

const getPost = async (req, res, next) => {
  const schema = Joi.object({
    slug: Joi.string().required(),
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return next(error);
  }

  try {
    const { slug } = req.query;
    const userId = req.pathType == 1 ? req.userId : req.user.id;
    doc = await Post.findOne({ slug: slug });
    if (!doc) {
      return res.status(400).json({ error: "No post available" });
    }

    let commentDoc;
    try {
      commentDoc = await Comment.findOne({ postId: doc._id });
    } catch (e) {
      console.log(e);
    }
    resultDoc = {
      postId: doc._id,
      postFileUrl: doc.postFileUrl,
      postLikesCount: doc.postLikesCount,
      postType: doc.postType,
      postComments: commentDoc ? commentDoc.comments : [],
      createdAt: Date.parse(doc.createdAt) / 1000,
    };
    const user = await User.findOne({ _id: doc.postUserId });
    if (user) {
      resultDoc = { ...resultDoc, userName: user.userName, profileImage: user.profileImageUrl };

      isLiked = false;
      if (userId != "") {
        // console.log(doc.postLikeUserIds)
        doc.postLikeUserIds.forEach((id) => {
          if (id == userId) {
            isLiked = true;
            resultDoc = { ...resultDoc, status: true };
          }
        });
      }
      if (!isLiked) {
        resultDoc = { ...resultDoc, status: false };
      }
    } else {
      return res.json(404).json({ error: "Post creater not found" });
    }

    return res.status(200).json({ post: resultDoc });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getPost;
