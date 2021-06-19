const mongoose = require('mongoose')

const notificationSchema=mongoose.Schema({
    postId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        trim: true
    },
    userId: {
        type:mongoose.Schema.ObjectId,
        required:true,
        trim: true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})


const CommentNotification = mongoose.model('CommentNotification',notificationSchema)
module.exports = CommentNotification