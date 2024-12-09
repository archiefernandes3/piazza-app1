const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
        enum: ['Politics', 'Health', 'Sport', 'Tech'],
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'],
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            user: { type: String }, 
            message: { type: String },
            timestamp: { type: Date, default: Date.now }, 
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


module.exports = mongoose.model('Post', PostSchema)
