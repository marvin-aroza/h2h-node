const mongoose = require('mongoose')

const newsSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    subtitle:{
        type:String,
        trim: true
    },
    body:{
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


const News = mongoose.model('News',newsSchema)
module.exports = News