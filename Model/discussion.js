const mongoose = require('mongoose')


//discussion comments
const discussionSchema=mongoose.Schema({
    postId:{
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


const DiscussionStruct = mongoose.model('Discussion',discussionSchema)


//discussion childComments
const subDiscussionSchema=mongoose.Schema({
    commentId:{
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
    isRemoved:{
        type: Boolean,
        default: false
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


const SubDiscussionStruct = mongoose.model('SubDiscussion',subDiscussionSchema)

module.exports = { Discussion: DiscussionStruct, SubDiscussion:SubDiscussionStruct}