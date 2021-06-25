const mongoose = require('mongoose')

const contactSchema=mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        trim:true
    },
    subject: {
        type:String,
        required: true,
        trim:true
    },
    message:{
        type:String,
        required: true
    },
    contactBy:{
        type: mongoose.Schema.ObjectId,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    response:{
        type:String,
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


const Contact = mongoose.model('Contact',contactSchema)
module.exports = Contact