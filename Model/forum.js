const mongoose = require('mongoose')

const forumSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    categoryId:{
        type:mongoose.Schema.ObjectId,
        required: true
    },
    body:{
        type:String,
        trim: true
    },
    image:{
        type:String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    isActive:{
        type:Boolean,
        default:false
    },
    isArchived:{
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


const Forum = mongoose.model('Forum',forumSchema)
module.exports = Forum