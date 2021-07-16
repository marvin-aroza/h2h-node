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
    category_id:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    subcategory_id:{
        type:String,
        //required:true
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
        type: mongoose.Schema.ObjectId,
        required: true
    },
    isActive:{
        type:Boolean,
        default:true
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
    },
    status:{
        type:String,
        default:"pending"
    },
    comments:{
        type:String
    },
    isPopular: {
        type: Boolean,
        default: false
    }
})


const Post = mongoose.model('Post',postschema)
module.exports = Post