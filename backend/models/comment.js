const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({

    postId: { type: 'string', required: true },
    comments: { type: Array },
}
    , {
        timestamps: true,
    })

module.exports = mongoose.model("Comment", commentSchema)