const Joi = require("joi");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");

const getPost = async (req, res, next) => {
  const schema = Joi.object({
    size: Joi.string().required(),
    nextToken: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return next(error);
  }
  // console.log(req.body);
  // console.log(req);
  try {
    const { size, nextToken } = req.params;
    const userId = req.pathType == 1 ? req.userId : req.user.id;

    documents = (await Post.find().skip(nextToken).limit(size)).reverse();
    if (!documents) {
      return res.status(400).json({ error: "No post available" });
    }

    newDocument = [];
    for (const doc of documents) {
      // console.log(doc);

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
        postCommentCount: commentDoc ? commentDoc.comments.length : 0,
        createdAt: Date.parse(doc.createdAt) / 1000,
        slug: doc.slug,
      };
      const user = await User.findOne({ _id: doc.postUserId });
      if (user) {
        resultDoc = { ...resultDoc, userName: user.userName, userImage: user.profileImageUrl };

        isLiked = false;
        if (userId != "") {
          // console.log(doc.postLikeUserIds)
          doc.postLikeUserIds.forEach((id) => {
            if (id == userId) {
              isLiked = true;
              newDocument.push({ ...resultDoc, status: true });
            }
          });
        }
        if (!isLiked) {
          newDocument.push({ ...resultDoc, status: false });
        }
      } else {
        console.log("object");
      }
    }
    return res.status(200).json({ posts: newDocument, nextToken: parseInt(size) + parseInt(nextToken) });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getPost;
