const mongoose = require('mongoose')

const eventSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    body:{
        type:String,
        required:true,
        trim: true
    },
    host: {
        type:String,
        required:true
    },
    place: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    image:{
        type:String,
        trim: true
    },
    status:{
        type:String,
        trim: true,
        default: 'Pending'
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


const Event = mongoose.model('Event',eventSchema)
module.exports = Event