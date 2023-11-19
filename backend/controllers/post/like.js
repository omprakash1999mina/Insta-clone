const Joi = require('joi');
const user = require('../../models/user')
const post = require('../../models/post')

const like = async (req, res, next) => {
    const schema = Joi.object({
        postId: Joi.string().required(),
        status: Joi.bool().required(),
    })

    const { error } = schema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { postId, status } = req.body
    const userId = req.pathType == 1 ? req.userId : req.user.id
    if (userId != "") {
        const userExist = user.exists({ _id: userId })
        if (!userExist) {
            return req.json(400).json({ error: "Unauthorized user" })
        }
    }
    const postExist = post.exists({ _id: postId })
    if (!postExist) {
        return req.json(400).json({ error: "Post does not exist" })
    }

    try {
        if (status === true) {
            document = await post.findById({ _id: postId })
            likesArray = document.postLikeUserIds;
            likesArray.push(userId)
            likeCount = document.postLikesCount + 1


            post.findByIdAndUpdate({ _id: postId },{postLikesCount:likeCount,postLikeUserIds:likesArray}
                ,function(err, result){
                    if(err){
                        return res.status(500).json({error:"Internal1 Server Error"})
                    }
                })

            return res.status(200).json({ message: "Post Liked" })
        }else{
            
            document = await post.findById({ _id: postId })
            likesArray = document.postLikeUserIds;
            let newLikeArray=[]
            likesArray.forEach((ele)=>{
                if(ele!=userId){
                    newLikeArray.push(ele)
                }
            })

            likeCount = document.postLikesCount - 1


            post.findByIdAndUpdate({ _id: postId },{postLikesCount:likeCount,postLikeUserIds:newLikeArray}
                ,function(err, result){
                    if(err){
                        return res.status(500).json({error:"Internal1 Server Error"})
                    }
                })

            return res.status(200).json({ message: "Post Disliked" })
        }
    } catch (err) { 
        console.log(err);
        return res.status(500).json({error:"Internal Server Error"})
    }

}

module.exports = like