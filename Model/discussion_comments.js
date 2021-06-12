const mongoose = require('mongoose')


//discussion comments
const commentSchema=mongoose.Schema({
    forumId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        trim: true
    },
    comment:{
        type:String,
        trim: true,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isReport:{
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

const Comments = mongoose.model('Comments',commentSchema)
module.exports = Comments