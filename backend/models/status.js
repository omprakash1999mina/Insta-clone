const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({
    userId: { type: 'string', required: true },
    fileUrl: { type: 'string', required: true },
    createdAt: { type: Date, expires: 86400, default: Date.now }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Status",statusSchema)