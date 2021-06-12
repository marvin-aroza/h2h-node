const mongoose = require('mongoose')

const postschema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    subtitle:{
        type:String,
        trim: true
    },
    description:{
        type:String,
        trim: true
    },
    image:{
        type:String,
        trim: true
    },
    video:{
        type:String,
        trim: true
    },
    createdBy: {
        type: String,
        required: true
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


const Post = mongoose.model('Post',postschema)
module.exports = Post