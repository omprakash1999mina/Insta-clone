const Joi = require('joi')
const Comments = require('../../models/comment')

const getComments = async(req, res, next) => {

    const schema = Joi.object({
        postId: Joi.string().required()
    })

    const { error } = schema.validate(req.query)
    if (error) {
        return next(error)
    }

    const { postId } = req.query

    try{
        const postComments = await Comments.findOne({ postId:postId })
        if(postComments){
            const commentArray = postComments.comments
            return res.status(200).json({comments: commentArray})
        }else{
            return res.status(404).json({error:"No comment exist"})
        }
    }catch(e){
        return res.status(500).json({error:"Internal Server Error"})
    }
    

}

module.exports = getComments