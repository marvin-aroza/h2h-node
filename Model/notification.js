const mongoose = require('mongoose')

const notificationSchema=mongoose.Schema({
    postId:{
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


const Notification = mongoose.model('Notification',notificationSchema)
module.exports = Notification