const Joi = require('joi')
const Comment = require('../../models/comment')
const User = require("../../models/user")

const createComment = async (req, res, next) => {

    const schema = Joi.object({
        postId: Joi.string().required(),
        comment: Joi.string().required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
        return next(error)
    }

    const { postId, comment } = req.body
    const userId = req.pathType == 1 ? req.userId : req.user.id
    const user = await User.findOne({ _id: userId })
    if (!user) {
        return res.status(401).json({ message: "user not found" })
    }



    try {
        const commentDoc = await Comment.findOne({ postId: postId })
        if (!commentDoc) {
            let commentArray = [];
            const currDate = Date.now().toString()
            const commentId = currDate.substring(0, 7) + (user.userName) + currDate.substring(7)

            const newComment = {
                id: commentId,
                commentorId: userId,
                commentorUserName: user.userName,
                profileImage: user.profileImageUrl,
                text: comment,
                createdAt: Date.now(),
            }

            commentArray.push(newComment);
            Comment.create({ postId: postId, comments: commentArray }).then(
                (response) => {
                    return res.status(200).json({ comment: newComment, message: "New comment new post" })
                }
            ).catch(err => {
                console.log(err);
                return res.status(500).json({ message: "Internal server errro" })

            })
        } else {
            let commentArray = commentDoc.comments;
            const currDate = Date.now().toString()
            const commentId = currDate.substring(0, 7) + (user.userName) + currDate.substring(7)

            const newComment = {
                id: commentId,
                commentorId: userId,
                commentorUserName: user.userName,
                profileImage: user.profileImageUrl,
                text: comment,
                createdAt: Date.now(),
            }

            commentArray.push(newComment);
            Comment.findOneAndUpdate({ postId: postId }, { comments: commentArray },
                function (err, result) {
                    if (err) {
                        return res.status(500).json({ error: "Internal1 Server Error" })
                    }
                }
            )

            return res.status(201).json({ comment: newComment, message: "New comment old post" })
        }


    } catch (e) {
        console.log(e);
    }




    // const postComment = await Comment.updateOne



}

module.exports = createComment