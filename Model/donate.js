const mongoose = require('mongoose')

const donateSchema=mongoose.Schema({
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


const DonateStruct = mongoose.model('Donate',donateSchema)


const donateRequestSchema=mongoose.Schema({
    body:{
        type:String,
        required:true,
        trim: true
    },
    donateId:{
        type:mongoose.Schema.ObjectId,
        required: true
    },
    reply:{
        type:String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    repliedBy: {
        type: mongoose.Schema.ObjectId,
        default: null,
        ref: 'User'
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
    }
})


const DonateRequestStruct = mongoose.model('DonateRequest',donateRequestSchema)

module.exports = { Donate: DonateStruct, DonateRequest:DonateRequestStruct}