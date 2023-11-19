const Joi = require('joi')
const Post = require('../../models/post')
const User = require('../../models/user')
const Comment = require('../../models/comment')

const getUserPosts = async(req, res, next) => {
    const schema = Joi.object({
        userName: Joi.string(),
        size: Joi.string().required(),
        nextToken: Joi.string().required()
    })

    const { error } = schema.validate(req.query);
    if (error) {
        return next(error)
    }

    const { userName, size, nextToken } = req.query

    const user = await User.findOne({ userName: userName })
    if (!user) {
        return res.status(404).json({ error: "user not found" })
    }
    
    
    documents = (await Post.find({ postUserId: user._id }).skip(nextToken).limit(size))
    // console.log(documents);
    if (!documents) {
        return res.status(400).json({ error: "No post available" });
    }
    
    newDocument = []
    for (const doc of documents) {
        const commentDoc = await Comment.findOne({ postId: doc._id })

        resultDoc = {
            postId: doc._id,
            postFileUrl: doc.postFileUrl,
            postLikesCount: doc.postLikesCount,
            postType: doc.postType,
            postCommentCount: commentDoc ? commentDoc.comments.length : 0,
            slug: doc.slug
        }
        newDocument.push(resultDoc)
    }
    return res.status(200).json({ posts: newDocument, nextToken: parseInt(size) + parseInt(nextToken) });
}

module.exports = getUserPosts